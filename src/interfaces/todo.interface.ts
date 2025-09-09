export interface Todo {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
    photoUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
}


export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

