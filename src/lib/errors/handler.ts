/**
 * Error Handler Utilities
 *
 * Provides centralized error handling for API routes
 *
 * @MX:NOTE: This module provides the handleApiError function which
 * should be used in all API route error handlers to ensure consistent
 * error responses across the application.
 */

import { NextResponse } from 'next/server';
import { isAppError, toAppError, type AppError } from './index';

/**
 * Handle API errors and return appropriate NextResponse
 *
 * This function standardizes error responses across all API routes:
 * - AppError instances: Return with their configured status and format
 * - Error instances: Wrapped in InternalServerError
 * - Unknown errors: Converted to InternalServerError
 *
 * @param error - The error to handle (can be any type)
 * @param context - Optional context information for debugging
 * @returns NextResponse with standardized error format
 *
 * @example
 * ```ts
 * try {
 *   // ... API logic
 * } catch (error) {
 *   return handleApiError(error, { route: '/api/chat' });
 * }
 * ```
 */
export function handleApiError(
  error: unknown,
  context?: Record<string, unknown>
): NextResponse {
  // Log error with context for debugging
  const logContext = context ? ` [${JSON.stringify(context)}]` : '';
  console.error(`API Error${logContext}:`, error);

  // Convert to AppError if not already
  const appError = toAppError(error);

  // Return standardized error response
  return NextResponse.json(appError.toJSON(), {
    status: appError.statusCode,
  });
}

/**
 * Handle API errors with custom logging
 *
 * Same as handleApiError but allows custom logging function
 *
 * @param error - The error to handle
 * @param logger - Custom logging function
 * @param context - Optional context information
 * @returns NextResponse with standardized error format
 */
export function handleApiErrorWithLogger(
  error: unknown,
  logger: (error: unknown, context?: Record<string, unknown>) => void,
  context?: Record<string, unknown>
): NextResponse {
  logger(error, context);
  const appError = toAppError(error);
  return NextResponse.json(appError.toJSON(), {
    status: appError.statusCode,
  });
}

/**
 * Async error handler wrapper
 *
 * Wraps an async function with error handling
 *
 * @param fn - The async function to wrap
 * @param context - Optional context for error handling
 * @returns Wrapped function with error handling
 *
 * @example
 * ```ts
 * export const GET = withErrorHandler(async (request) => {
 *   // ... API logic
 * }, { route: '/api/users' });
 * ```
 */
export function withErrorHandler<T extends Request>(
  fn: (request: T) => Promise<NextResponse>,
  context?: Record<string, unknown>
): (request: T) => Promise<NextResponse> {
  return async (request: T): Promise<NextResponse> => {
    try {
      return await fn(request);
    } catch (error) {
      return handleApiError(error, context);
    }
  };
}

/**
 * Create error response directly
 *
 * Creates an error response without throwing an error
 *
 * @param code - Error code
 * @param message - Error message
 * @param statusCode - HTTP status code
 * @param details - Optional error details
 * @returns NextResponse with error format
 */
export function createErrorResponse(
  code: string,
  message: string,
  statusCode: number = 500,
  details?: unknown
): NextResponse {
  const errorResponse: {
    error: {
      code: string;
      message: string;
      details?: unknown;
    };
  } = {
    error: {
      code,
      message,
    },
  };

  if (details) {
    errorResponse.error.details = details;
  }

  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * Extract error information from unknown error
 *
 * Safely extracts error code, message, and status from unknown error type
 *
 * @param error - Unknown error
 * @returns Error information object
 */
export function getErrorInfo(error: unknown): {
  code: string;
  message: string;
  statusCode: number;
  details?: unknown;
} {
  if (isAppError(error)) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'INTERNAL_ERROR',
      message: error.message,
      statusCode: 500,
    };
  }

  return {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    statusCode: 500,
  };
}
