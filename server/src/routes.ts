import express, { request } from 'express';
import ClassesController from './controllers/ClassesController';
import ConnentionsController from './controllers/ConnectionsController';

const routes = express.Router();

const classesController = new ClassesController();
const connectionsController = new ConnentionsController();

routes.post('/classes', classesController.create);
routes.get('/classes', classesController.index);
routes.get('/list', classesController.listAll);

routes.post('/connections', connectionsController.create);
routes.get('/connections', connectionsController.index);


export default routes;