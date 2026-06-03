export class AppError extends Error {
  public readonly code: number;
  public readonly operational: boolean;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.operational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(resource + ' not found', 404);
  }
}

export class ValidationError extends AppError {
  public readonly details: string;

  constructor(details: string) {
    super('Validation failed', 400);
    this.details = details;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
  }
}

export class UninmplementedError extends AppError {
  constructor(message: string = 'This endpoint is not implemented yet') {
    super(message, 501);
  }
}
