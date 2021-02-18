const { Router } = require('express');
const multer = require('multer')

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController')
const FileController = require('./app/controllers/FileController')
const multerConfig = require('./config/multer')
const authMiddleware = require('./app/middlewares/auth')
const ProviderController = require('./app/controllers/ProviderController')
const AppointmentController = require('./app/controllers/AppointmentController')
const ScheduleController = require('./app/controllers/ScheduleController')
const NotificationController = require('./app/controllers/NotificationController')

const routes = new Router();
const upload = multer(multerConfig)

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware)

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store)
routes.get('/providers', ProviderController.index)
routes.post('/appointments', AppointmentController.store)
routes.get('/appointments', AppointmentController.index)
routes.delete('/appointments/:id', AppointmentController.delete)
routes.get('/schedule', ScheduleController.index)
routes.get('/notifications', NotificationController.index)
routes.put('/notifications/:id', NotificationController.update)

module.exports = routes;