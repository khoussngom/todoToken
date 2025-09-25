import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import router from './src/routes/todo.routes'
import * as userRouter  from './src/routes/user.route';
import notificationRouter from './src/routes/notification.routes';
import { SchedulerService } from './src/services/scheduler.service';
import notificationRouter from './src/routes/notification.routes';
import { SchedulerService } from './src/services/scheduler.service';
import { errorHandler, notFoundHandler,} from './src/middleware/error.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5200;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialiser le service de planification
const schedulerService = new SchedulerService();

// Initialiser le service de planification
const schedulerService = new SchedulerService();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));


app.use('/api', router);
app.use('/api', userRouter.default);
app.use('/api', notificationRouter);
app.use('/api', notificationRouter);

app.get('/', (req, res) => {
res.status(200).json({
    documentation: {
        baseUrl: '/api',
        endpoints: [
            'GET /api/todo - Liste des todos',
            'POST /api/todo - Créer un todo',
            'GET /api/todo/:id - Récupérer un todo',
            'PUT /api/todo/:id - Modifier un todo',
            'DELETE /api/todo/:id - Supprimer un todo',
            'GET /api/notifications - Liste des notifications',
            'GET /api/notifications/unread-count - Nombre de notifications non lues',
            'PUT /api/notifications/:id/read - Marquer une notification comme lue',
            'PUT /api/notifications/read-all - Marquer toutes les notifications comme lues'
            'DELETE /api/todos - Supprimer tous les todos',
            'GET /api/notifications - Liste des notifications',
            'PUT /api/notifications/:id/read - Marquer une notification comme lue',
            'PUT /api/notifications/read-all - Marquer toutes les notifications comme lues'
        ]
        }
    });
});

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(PORT, () => {
            console.log(' Serveur démarré avec succès !');
            console.log(` URL: http://localhost:${PORT}`);
        });




export default app;
