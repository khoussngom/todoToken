import * as cron from 'node-cron';
import { TodoRepository } from '../repository/todo.repository';
import { NotificationService } from './notification.service';

export class SchedulerService {
    private todoRepository: TodoRepository;
    private notificationService: NotificationService;

    constructor() {
        this.todoRepository = new TodoRepository();
        this.notificationService = new NotificationService();
        this.initializeSchedulers();
    }

    private initializeSchedulers(): void {
        // Vérifier les échéances toutes les heures
        cron.schedule('0 * * * *', () => {
            this.checkDeadlines();
        });

        // Vérifier les tâches en retard tous les jours à 9h
        cron.schedule('0 9 * * *', () => {
            this.checkOverdueTodos();
        });

        console.log('📅 Schedulers de notifications initialisés avec succès');
    }

    private async checkDeadlines(): Promise<void> {
        try {
            const now = new Date();
            const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            // Récupérer les todos avec une échéance dans les 24h
            const todos = await this.todoRepository.findAll({
                where: {
                    completed: false,
                    endTime: {
                        gte: now,
                        lte: in24Hours
                    }
                }
            });

            for (const todo of todos) {
                await this.notificationService.notifyTodoDeadline(
                    todo.id,
                    todo.userId,
                    todo.title
                );
            }

            console.log(`⏰ Vérification des échéances: ${todos.length} notifications envoyées`);
        } catch (error) {
            console.error('Erreur lors de la vérification des échéances:', error);
        }
    }

    private async checkOverdueTodos(): Promise<void> {
        try {
            const now = new Date();

            // Récupérer les todos en retard
            const overdueTodos = await this.todoRepository.findAll({
                where: {
                    completed: false,
                    endTime: {
                        lt: now
                    }
                }
            });

            for (const todo of overdueTodos) {
                await this.notificationService.notifyTodoOverdue(
                    todo.id,
                    todo.userId,
                    todo.title
                );
            }

            console.log(`⚠️ Vérification des retards: ${overdueTodos.length} notifications envoyées`);
        } catch (error) {
            console.error('Erreur lors de la vérification des retards:', error);
        }
    }

    public async checkTodoStatus(todoId: number): Promise<void> {
        try {
            const todo = await this.todoRepository.findById(todoId);
            if (!todo) return;

            const now = new Date();

            // Vérifier si la tâche est en retard
            if (todo.endTime && new Date(todo.endTime) < now && !todo.completed) {
                await this.notificationService.notifyTodoOverdue(
                    todo.id,
                    todo.userId,
                    todo.title
                );
            }
            // Vérifier si l'échéance approche (dans les 24h)
            else if (todo.endTime && new Date(todo.endTime) <= new Date(now.getTime() + 24 * 60 * 60 * 1000) && !todo.completed) {
                await this.notificationService.notifyTodoDeadline(
                    todo.id,
                    todo.userId,
                    todo.title
                );
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du statut de la tâche:', error);
        }
    }
}