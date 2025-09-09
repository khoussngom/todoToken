import express from 'express';
import dotenv from 'dotenv';
import router from './src/routes/todo.routes';
import { errorHandler, notFoundHandler, } from './src/middleware/error.middleware.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5200;
const NODE_ENV = process.env.NODE_ENV || 'development';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);
app.get('/', (req, res) => {
    res.status(200).json({
        documentation: {
            baseUrl: '/api',
            endpoints: [
                'GET /api/todos - Liste des todos',
                'POST /api/todos - Créer un todo',
                'GET /api/todos/:id - Récupérer un todo',
                'PUT /api/todos/:id - Modifier un todo',
                'DELETE /api/todos/:id - Supprimer un todo',
                'DELETE /api/todos - Supprimer tous les todos'
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
