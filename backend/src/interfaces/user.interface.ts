export interface User {
    id: number;
    email: string;
    password: string;
    name: string | null;
    role: string;
    googleId: string | null;
    photoURL: string | null;
}
