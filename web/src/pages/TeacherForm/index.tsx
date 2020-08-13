import React, {useState, FormEvent} from 'react';
import PageHeader from '../../components/PageHeader';
import { useHistory } from 'react-router-dom';

import './styles.css';
import warningIcon from '../../assets/images/icons/warning.svg';
import Input from '../../components/Input';
import Textarea from '../../components/TextArea';
import Select from '../../components/Select';
import api from '../../services/api';

function TeacherForm() {
  const history = useHistory();
  const [name,setName] = useState("");
  const [avatar,setAvatar] = useState("");
  const [whatsapp,setWhatsapp] = useState("");
  const [bio,setBio] = useState("");

  const [subject,setSubject] = useState("");
  const [cost,setCost] = useState("");

  const [scheduleItems, setScheduleItems] = useState([
    {week_day: 0, from: '', to: ''}
  ]);

  function addNewScheduleItem(){
    setScheduleItems([
      ...scheduleItems, 
      {week_day: 0, from: '', to: ''}
    ]);
  }

  function setScheduleItemValue(position: number, field: string, value: string){
    const newArray = scheduleItems.map((item, index)=>{
      if (index === position){
        return { ...item, [field]: value};
      }
      return item;
    });

    setScheduleItems(newArray);
  }

  function handleCreateClass(e:FormEvent){
    e.preventDefault(); // previne dar reload na pág quando submit
    
    api.post('/classes', {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost: Number(cost),
      schedule: scheduleItems
    }).then(()=>{
      alert('Cadastro realizado com sucesso!');
      history.push('/');
    }).catch(()=>{alert('Erro no cadastro')})
  }
  
  return (
    <div id="page-teacher-form" className="container">
      <PageHeader 
        title="Que incrível que você quer dar aulas! :D"
        description="O primeiro passo é preencher este formulário de inscrição!"
      />

      <main>
      <form onSubmit={handleCreateClass}>
        <fieldset>
          <legend>Seus dados</legend>
          <Input 
            name="name" 
            label="Nome completo" 
            value={name} 
            onChange={(e)=>{setName(e.target.value)}} 
          />
          <Input 
            name="avatar" 
            label="Avatar" 
            value={avatar} 
            onChange={(e)=>{setAvatar(e.target.value)}}
          />
          <Input 
            name="whatsapp" 
            label="WhatsApp" 
            value={whatsapp} 
            onChange={(e)=>{setWhatsapp(e.target.value)}}
          />
          <Textarea 
            name="bio" 
            label="Biografia" 
            value={bio} 
            onChange={(e)=>{setBio(e.target.value)}}
          />
        </fieldset>

        <fieldset>
          <legend>Sobre a aula</legend>
            <Select 
              name="subject" 
              label="Matéria" 
              value={subject}
              onChange={(e)=> {setSubject(e.target.value)}}
              options={[
                {value: 'Artes', label: 'Artes'},
                {value: 'Biologia', label: 'Biologia'},
                {value: 'Matemática', label: 'Matemática'},
                {value: 'Física', label: 'Física'},
                {value: 'Química', label: 'Química'},
                {value: 'História', label: 'História'},
                {value: 'Geografia', label: 'Geografia'},
                {value: 'Filosofia', label: 'Filosofia'},
                {value: 'Português', label: 'Português'},
              ]}
            />
            <Input 
              name="cost" 
              label="Custo da sua hora/aula"
              value={cost}
              onChange={(e)=> {setCost(e.target.value)}}
            />
        </fieldset>

      <fieldset>
        <legend>Horários disponíveis
        <button type="button" onClick={addNewScheduleItem}>+ Novo horário</button>
        </legend>

        {scheduleItems.map((item, index) => {
          return (
          <div key={index} className="schedule-item">
            <Select 
              name="subject" 
              label="Dia da semana"
              value={item.week_day}
              onChange={e=> setScheduleItemValue(index, 'week_day', e.target.value)}
              options={[
                {value: '0', label: 'Domingo'},
                {value: '1', label: 'Segunda'},
                {value: '2', label: 'Terça'},
                {value: '3', label: 'Quarta'},
                {value: '4', label: 'Quinta'},
                {value: '5', label: 'Sexta'},
                {value: '6', label: 'Sábado'},
              ]}
            />
            <Input 
              name="from"
              label="Das" 
              type="time"
              value={item.from}
              onChange={e=> setScheduleItemValue(index, 'from', e.target.value)} 
            />
            <Input 
              name="to"
              label="Até" 
              type="time"
              value={item.to}
              onChange={e=> setScheduleItemValue(index, 'to', e.target.value)} 
            />
            </div>
          )
        })
        }

        </fieldset>

        <footer>
          <p>
            <img src={warningIcon} alt="Aviso importate"/>
            Importante! <br/>
            Preencha todos os dados
          </p>
          <button type="submit">Salvar cadastro</button>
        </footer>
      </form>
      </main>
    </div>
  ) 
}
export default TeacherForm;
