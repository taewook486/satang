/**
 * Chat API Validation Schemas
 *
 * Zod schemas for chat-related API endpoints
 *
 * @MX:NOTE: These schemas ensure that chat API requests are properly
 * validated before processing. All required fields must be present
 * and optional fields have appropriate defaults.
 */

import { z } from 'zod';
import { notebookIdSchema, VALIDATION_ERRORS } from './common';

/**
 * Chat message role
 */
export const chatMessageRoleSchema = z.enum(['user', 'assistant', 'system']);

/**
 * Chat message schema
 */
export const chatMessageSchema = z.object({
  role: chatMessageRoleSchema,
  content: z.string().min(1, VALIDATION_ERRORS.REQUIRED),
  timestamp: z.coerce.date().optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

/**
 * Chat POST request schema
 */
export const chatPostSchema = z.object({
  notebookId: notebookIdSchema,
  message: z.string().min(1, '메시지는 필수입니다.'),
});

export type ChatPostRequest = z.infer<typeof chatPostSchema>;

/**
 * Chat history item schema
 */
export const chatHistoryItemSchema = z.object({
  role: chatMessageRoleSchema,
  content: z.string(),
  created_at: z.coerce.date().optional(),
});

export type ChatHistoryItem = z.infer<typeof chatHistoryItemSchema>;
