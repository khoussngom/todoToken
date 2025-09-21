export class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode, isOperational = true, stack = '') {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
export class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}
export class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}
