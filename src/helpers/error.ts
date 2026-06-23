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
  constructor(resource: string = 'Resource') {
    const message = resource + ' not found';
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Data is not valid, re-check the payload') {
    super(message, 422);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Data already exists or violates duplicate constraint') {
    super(message, 409);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication token required') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
  }
}

export class UninmplementedError extends AppError {
  constructor(message: string = 'This function is not implemented yet') {
    super(message, 501);
  }
}
