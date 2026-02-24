/**
 * Validation Middleware
 *
 * Provides middleware utilities for validating API requests using Zod schemas
 *
 * @MX:NOTE: Use validateRequest or validateOrThrow in API routes to ensure
 * all requests are properly validated before processing. This prevents
 * invalid data from reaching business logic and provides clear error messages.
 */

import { z, type ZodError } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { ValidationError } from '../errors';

/**
 * Format Zod error into a readable message
 *
 * @param error - Zod validation error
 * @returns Formatted error message
 */
function formatZodError(error: z.ZodError): string {
  const firstIssue = error.issues[0];
  if (!firstIssue) {
    return 'Validation failed';
  }

  const field = firstIssue.path.length > 0 ? firstIssue.path.join('.') : 'Field';
  return `${field}: ${firstIssue.message}`;
}

/**
 * Validate request body against a Zod schema
 *
 * Parses and validates the request JSON body against the provided schema.
 * Returns the validated data or throws a ValidationError.
 *
 * @param request - NextRequest object
 * @param schema - Zod schema to validate against
 * @returns Validated and parsed data
 * @throws ValidationError if validation fails
 *
 * @example
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const body = await validateRequest(request, chatPostSchema);
 *   // body is now typed and validated
 * }
 * ```
 */
export async function validateRequest<T extends z.ZodType>(
  request: NextRequest,
  schema: T
): Promise<z.infer<T>> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(formatZodError(error), error.issues);
    }
    if (error instanceof SyntaxError) {
      throw new ValidationError('Invalid JSON format');
    }
    throw error;
  }
}

/**
 * Validate request body and return result object
 *
 * Similar to validateRequest but returns a result object instead of throwing.
 * Use this when you want to handle validation errors manually.
 *
 * @param request - NextRequest object
 * @param schema - Zod schema to validate against
 * @returns Result object with success flag
 *
 * @example
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const result = await validateOrThrow(request, chatPostSchema);
 *   if (!result.success) {
 *     return result.error; // NextResponse with error
 *   }
 *   // result.data is typed and validated
 * }
 * ```
 */
export async function validateOrThrow<T extends z.ZodType>(
  request: NextRequest,
  schema: T
): Promise<
  | { success: true; data: z.infer<T> }
  | { success: false; error: NextResponse }
> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = new ValidationError(
        formatZodError(error),
        error.issues
      );
      return {
        success: false,
        error: NextResponse.json(validationError.toJSON(), {
          status: validationError.statusCode,
        }),
      };
    }
    if (error instanceof SyntaxError) {
      const validationError = new ValidationError('Invalid JSON format');
      return {
        success: false,
        error: NextResponse.json(validationError.toJSON(), {
          status: validationError.statusCode,
        }),
      };
    }
    throw error;
  }
}

/**
 * Create validation middleware
 *
 * Returns a middleware function that validates requests against a schema
 * before passing them to the handler.
 *
 * @param schema - Zod schema to validate against
 * @param handler - Request handler function
 * @returns Middleware function
 *
 * @example
 * ```ts
 * export const POST = withValidation(chatPostSchema, async (request, body) => {
 *   // body is validated and typed
 *   return NextResponse.json({ success: true });
 * });
 * ```
 */
export function withValidation<T extends z.ZodType>(
  schema: T,
  handler: (request: NextRequest, body: z.infer<T>) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const body = await request.json();
      const validated = schema.parse(body);
      return handler(request, validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = new ValidationError(
          formatZodError(error),
          error.issues
        );
        return NextResponse.json(validationError.toJSON(), {
          status: validationError.statusCode,
        });
      }
      if (error instanceof SyntaxError) {
        const validationError = new ValidationError('Invalid JSON format');
        return NextResponse.json(validationError.toJSON(), {
          status: validationError.statusCode,
        });
      }
      throw error;
    }
  };
}

/**
 * Validate query parameters
 *
 * Validates URL query parameters against a Zod schema
 *
 * @param request - NextRequest object
 * @param schema - Zod schema to validate against
 * @returns Validated and parsed query parameters
 * @throws ValidationError if validation fails
 *
 * @example
 * ```ts
 * export async function GET(request: NextRequest) {
 *   const query = await validateQuery(request, paginationSchema);
 *   // query is now typed and validated
 * }
 * ```
 */
export async function validateQuery<T extends z.ZodType>(
  request: NextRequest,
  schema: T
): Promise<z.infer<T>> {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(formatZodError(error), error.issues);
    }
    throw error;
  }
}

/**
 * Validate request with both body and query parameters
 *
 * Validates both request body and query parameters against their schemas
 *
 * @param request - NextRequest object
 * @param bodySchema - Zod schema for request body
 * @param querySchema - Zod schema for query parameters
 * @returns Object with validated body and query
 * @throws ValidationError if validation fails
 *
 * @example
 * ```ts
 * export async function GET(request: NextRequest) {
 *   const { body, query } = await validateRequestWithQuery(
 *     request,
 *     filterSchema,
 *     paginationSchema
 *   );
 * }
 * ```
 */
export async function validateRequestWithQuery<TBody extends z.ZodType, TQuery extends z.ZodType>(
  request: NextRequest,
  bodySchema: TBody,
  querySchema: TQuery
): Promise<{
  body: z.infer<TBody>;
  query: z.infer<TQuery>;
}> {
  const body = await validateRequest(request, bodySchema);
  const query = await validateQuery(request, querySchema);
  return { body, query };
}

/**
 * Safely parse data with a schema (no throw)
 *
 * Validates data against a schema and returns a result object
 * without throwing. Useful for non-API validation scenarios.
 *
 * @param data - Data to validate
 * @param schema - Zod schema to validate against
 * @returns Result object with success flag and data or error
 *
 * @example
 * ```ts
 * const result = safeParse(userData, userSchema);
 * if (result.success) {
 *   // result.data is valid
 * } else {
 *   // result.error contains validation details
 * }
 * ```
 */
export function safeParse<T extends z.ZodType>(
  data: unknown,
  schema: T
):
  | { success: true; data: z.infer<T> }
  | { success: false; error: z.ZodError<z.infer<T>> } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
