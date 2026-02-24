/**
 * Common Zod Schemas
 *
 * Provides reusable Zod schemas for common data types
 *
 * @MX:NOTE: These schemas are used across multiple API routes.
 * When adding new common schemas, consider their reusability
 * and place them in the appropriate section.
 */

import { z } from 'zod';

/**
 * Common language codes
 */
export const LANGUAGE_CODES = [
  'ko',
  'en',
  'ja',
  'zh',
  'es',
  'fr',
  'de',
] as const;

/**
 * Language code schema
 */
export const languageCodeSchema = z.enum(LANGUAGE_CODES);

/**
 * Common slide formats
 */
export const SLIDE_FORMATS = ['detailed', 'presenter'] as const;

/**
 * Slide format schema
 */
export const slideFormatSchema = z.enum(SLIDE_FORMATS);

/**
 * Common orientations
 */
export const ORIENTATIONS = ['landscape', 'portrait', 'square'] as const;

/**
 * Orientation schema
 */
export const orientationSchema = z.enum(ORIENTATIONS);

/**
 * Common detail levels
 */
export const DETAIL_LEVELS = ['concise', 'standard', 'detailed'] as const;

/**
 * Detail level schema
 */
export const detailLevelSchema = z.enum(DETAIL_LEVELS);

/**
 * Page number positions
 */
export const PAGE_NUMBER_POSITIONS = [
  'top-right',
  'bottom-right',
  'bottom-center',
] as const;

/**
 * Page number position schema
 */
export const pageNumberPositionSchema = z.enum(PAGE_NUMBER_POSITIONS);

/**
 * Notebook ID schema (UUID or string)
 */
export const notebookIdSchema = z.string().min(1, '노트북 ID는 필수입니다.');

/**
 * Source ID schema (UUID or string)
 */
export const sourceIdSchema = z.string().min(1, '소스 ID는 필수입니다.');

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export type Pagination = z.infer<typeof paginationSchema>;

/**
 * Sort order schema
 */
export const sortOrderSchema = z.enum(['asc', 'desc']);

export type SortOrder = z.infer<typeof sortOrderSchema>;

/**
 * Date range schema
 */
export const dateRangeSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type DateRange = z.infer<typeof dateRangeSchema>;

/**
 * ID list schema (for filtering by multiple IDs)
 */
export const idListSchema = z.array(z.string().min(1));

export type IdList = z.infer<typeof idListSchema>;

/**
 * Search query schema
 */
export const searchQuerySchema = z.object({
  q: z.string().min(1).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

/**
 * Common validation error messages
 */
export const VALIDATION_ERRORS = {
  REQUIRED: '이 필드는 필수입니다.',
  INVALID_FORMAT: '잘못된 형식입니다.',
  INVALID_EMAIL: '유효한 이메일 주소를 입력해주세요.',
  INVALID_URL: '유효한 URL을 입력해주세요.',
  INVALID_DATE: '유효한 날짜를 입력해주세요.',
  TOO_SHORT: '너무 짧습니다.',
  TOO_LONG: '너무 깁니다.',
  INVALID_RANGE: '유효하지 않은 범위입니다.',
  INVALID_TYPE: '잘못된 타입입니다.',
} as const;
