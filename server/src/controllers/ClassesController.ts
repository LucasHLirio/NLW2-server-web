import { Request, Response } from 'express';
import database from '../database/connection';
import convertHour2Minutes from '../utils/convertHour2Minutes';

interface ScheduleItem{
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController{
  async listAll(request: Request, response:Response){
    const allClasses = await database('classes').select(['classes.*','users.*'])
    .join('users','classes.user_id','=','users.id')
    
    response.json(allClasses);
  }
  
  async index(request: Request, response:Response){
    const filters = request.query;

    const subject = filters.subject as string;
    const week_day = filters.week_day as string;
    const time = filters.time as string;

    if(!filters.week_day || !filters.subject || !filters.time){
      return response.status(400).json({
        error: 'Missing filters to search classes'
      })
    }
    
    const timeInminutes = convertHour2Minutes(filters.time as string);

    const classes = await database('classes')
      .whereExists(function(){
        this.select('class_schedule.*')
        .from('class_schedule')
        .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
        .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
        .whereRaw('`class_schedule`.`from` <= ??', [timeInminutes])
        .whereRaw('`class_schedule`.`to` > ??', [timeInminutes])
      })
      .where('classes.subject','=',subject)
      .join('users','classes.user_id','=','users.id')
      .select(['classes.*','users.*'])
    ;

    return response.json(classes);
    
  }
  
  async create(request: Request, response:Response){
    const {name, avatar, whatsapp, bio, subject, cost, schedule} = request.body;
    
    const transact = await database.transaction();
    
    try {
      const insertedUsersIDs = await transact('users').insert({
        name,
        avatar,
        whatsapp,
        bio,
      });
    
      const user_id = insertedUsersIDs[0];
    
      const insertedClassesIDs = await transact('classes').insert({
        subject,
        cost, 
        user_id
      });
    
      const class_id = insertedClassesIDs[0];
    
      const classSchedule = schedule.map((item: ScheduleItem) => {
        return {
          class_id,
          week_day: item.week_day,
          from: convertHour2Minutes(item.from),
          to: convertHour2Minutes(item.to),
        }
      })
    
      await transact('class_schedule').insert(classSchedule);
    
      await transact.commit();
    
      return response.status(210).send();
  
    } catch (error) {
  
      transact.rollback();
  
      return response.status(400).json({Error: "Unexpected erros while creating a new class"});
    }
    
  }
}