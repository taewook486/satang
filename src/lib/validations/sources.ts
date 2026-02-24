/**
 * Sources API Validation Schemas
 *
 * Zod schemas for source-related API endpoints (upload, process, etc.)
 *
 * @MX:NOTE: These schemas ensure that source API requests are properly
 * validated before processing. File uploads and URL sources have
 * specific validation requirements.
 */

import { z } from 'zod';
import { notebookIdSchema, VALIDATION_ERRORS } from './common';

/**
 * Source type enum
 */
export const sourceTypeSchema = z.enum(['pdf', 'url', 'text']);

/**
 * Source processing status enum
 */
export const sourceProcessingStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
]);

/**
 * Sources upload POST request schema (for URL/text sources)
 */
export const sourcesUploadPostSchema = z.object({
  notebookId: notebookIdSchema,
  type: sourceTypeSchema,
  url: z.string().url(VALIDATION_ERRORS.INVALID_URL).optional(),
  text: z.string().min(1).max(100000).optional(),
  title: z.string().min(1).max(500).optional(),
});

export type SourcesUploadPostRequest = z.infer<typeof sourcesUploadPostSchema>;

/**
 * Source update schema
 */
export const sourceUpdateSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  isEnabled: z.boolean().optional(),
});

export type SourceUpdateRequest = z.infer<typeof sourceUpdateSchema>;

/**
 * Sources process POST request schema (for re-processing)
 */
export const sourcesProcessPostSchema = z.object({
  sourceId: z.string().min(1, '소스 ID는 필수입니다.'),
  force: z.boolean().optional().default(false),
});

export type SourcesProcessPostRequest = z.infer<typeof sourcesProcessPostSchema>;

/**
 * Source item schema
 */
export const sourceItemSchema = z.object({
  id: z.string(),
  notebook_id: z.string(),
  title: z.string(),
  type: sourceTypeSchema,
  is_enabled: z.boolean(),
  processing_status: sourceProcessingStatusSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().optional(),
  extracted_text: z.string().optional(),
  error_message: z.string().optional(),
  file_size: z.number().int().nonnegative().optional(),
  page_count: z.number().int().nonnegative().optional(),
});

export type SourceItem = z.infer<typeof sourceItemSchema>;
