import { z } from 'zod';
export const createTodoSchema = z.object({
    title: z.string().min(1, 'Le titre est requis').max(255, 'Le titre ne peut pas dépasser 255 caractères').trim(),
    description: z.string().max(1000, 'La description ne peut pas dépasser 1000 caractères').trim().optional(),
    photoUrl: z.string().min(1).optional().nullable(),
    userId: z.number().int().positive('L\'ID utilisateur doit être un entier positif')
});
export const updateTodoSchema = z.object({
    title: z.string().min(1, 'Le titre est requis').max(255, 'Le titre ne peut pas dépasser 255 caractères').trim().optional(),
    description: z.string().max(1000, 'La description ne peut pas dépasser 1000 caractères').trim().optional().nullable(),
    photoUrl: z.string().min(1).optional().nullable(),
    completed: z.boolean().optional()
});
export const todoParamsSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID invalide').transform(val => parseInt(val, 10))
});
export const completedFilterSchema = z.object({
    completed: z.string().transform(val => val === 'true').pipe(z.boolean()).optional(),
    userId: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().positive('L\'ID utilisateur doit être un entier positif')).optional()
});
