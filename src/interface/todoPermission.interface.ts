export interface TodoPermission {
    id: number;
    todoId: number;
    userId: number;
    canEdit: boolean;
    canDelete: boolean;
    createdAt: Date;
}

export interface CreateTodoPermissionInput {
    todoId: number;
    userId: number;
    canEdit?: boolean;
    canDelete?: boolean;
}

export interface UpdateTodoPermissionInput {
    canEdit?: boolean;
    canDelete?: boolean;
}

export interface TodoPermissionWithUser extends TodoPermission {
    user: {
        id: number;
        name: string | null;
        email: string;
    };
}

export interface TodoPermissionResponse {
    success: boolean;
    data?: TodoPermission | TodoPermission[] | TodoPermissionWithUser[];
    message?: string;
    error?: string;
}
