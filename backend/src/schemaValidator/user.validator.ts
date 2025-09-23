import { z } from 'zod';

export const userSchema = z.object({
    email: z.string().email("email invalide"),
    password: z.string().min(6,"le mot de passe  doit avoir au minimum de 6 caracteres").max(100,"password invalide!"),
    name: z.string().min(2,"le name doit avoir au minimum de 2 caracteres").max(100,"le name doit avoir au maximum 100 caracteres").optional().nullable(),
    role: z.enum(["USER", "ADMIN"]).optional()
});

export const googleAuthSchema = z.object({
    email: z.string().email("email invalide"),
    name: z.string().min(1,"le nom est requis").max(100,"le nom est trop long"),
    googleId: z.string().min(1,"Google ID est requis"),
    photoURL: z.string().url("URL de photo invalide").optional().nullable()
});

export type CreateUserInput = z.infer<typeof userSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;