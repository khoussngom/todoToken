import { z } from 'zod';

export const createTodoSchema = z.object({
    title: z.string().min(1, 'Le titre est requis').max(255, 'Le titre ne peut pas dépasser 255 caractères').trim(),
    description: z.string().max(1000, 'La description ne peut pas dépasser 1000 caractères').trim().optional(),
    userId: z.number().int().positive('L\'ID utilisateur doit être un entier positif'),
    startTime: z.string().datetime('Format de date invalide').optional().nullable(),
    endTime: z.string().datetime('Format de date invalide').optional().nullable()
});

export const updateTodoSchema = z.object({
    title: z.string().min(1, 'Le titre est requis').max(255, 'Le titre ne peut pas dépasser 255 caractères').trim().optional(),
    description: z.string().max(1000, 'La description ne peut pas dépasser 1000 caractères').trim().optional().nullable(),
    completed: z.boolean().optional(),
    startTime: z.string().datetime('Format de date invalide').optional().nullable(),
    endTime: z.string().datetime('Format de date invalide').optional().nullable()
});

export const todoParamsSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID invalide').transform(val => parseInt(val, 10))
});

export const completedFilterSchema = z.object({
    completed: z.string().transform(val => val === 'true').pipe(z.boolean()).optional(),
userId: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().positive('L\'ID utilisateur doit être un entier positif')).optional()});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoParams = z.infer<typeof todoParamsSchema>;
export type CompletedFilter = z.infer<typeof completedFilterSchema>;
