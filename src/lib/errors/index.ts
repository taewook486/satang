/**
 * Custom Error Classes
 *
 * Provides a hierarchy of error types for consistent error handling
 * across the application. All custom errors extend from AppError.
 *
 * @MX:NOTE: Error classes are used throughout the application for
 * consistent error responses. When adding new error types, ensure
 * they have a unique code and appropriate HTTP status mapping.
 */

/**
 * Base application error class
 * All custom errors should extend from this class
 */
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    const errorResponse: {
      error: {
        code: string;
        message: string;
        details?: unknown;
      };
    } = {
      error: {
        code: this.code,
        message: this.message,
      },
    };

    if (this.details) {
      errorResponse.error.details = this.details;
    }

    return errorResponse;
  }
}

/**
 * Validation Error (400 Bad Request)
 * Use when request validation fails
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

/**
 * Authentication Error (401 Unauthorized)
 * Use when user is not authenticated
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Unauthorized', details?: unknown) {
    super('AUTH_ERROR', message, 401, details);
  }
}

/**
 * Not Found Error (404 Not Found)
 * Use when a resource is not found
 */
export class NotFoundError extends AppError {
  constructor(message: string, details?: unknown) {
    super('NOT_FOUND', message, 404, details);
  }
}

/**
 * Conflict Error (409 Conflict)
 * Use when there's a conflict with the current state
 */
export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super('CONFLICT', message, 409, details);
  }
}

/**
 * Rate Limit Error (429 Too Many Requests)
 * Use when rate limit is exceeded
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests', details?: unknown) {
    super('RATE_LIMIT_EXCEEDED', message, 429, details);
  }
}

/**
 * Internal Server Error (500 Internal Server Error)
 * Use when an unexpected error occurs
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', details?: unknown) {
    super('INTERNAL_ERROR', message, 500, details);
  }
}

/**
 * Service Unavailable Error (503 Service Unavailable)
 * Use when a service is temporarily unavailable
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service temporarily unavailable', details?: unknown) {
    super('SERVICE_UNAVAILABLE', message, 503, details);
  }
}

/**
 * Type guard to check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Convert unknown error to AppError
 * If the error is already an AppError, return it as-is
 * Otherwise, wrap it in an InternalServerError
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new InternalServerError(error.message);
  }

  return new InternalServerError('An unexpected error occurred');
}

// Re-export error handler utilities
export * from './handler';
