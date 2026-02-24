/**
 * Studio API Validation Schemas
 *
 * Zod schemas for studio-related API endpoints (slides, mindmap, infographic, etc.)
 *
 * @MX:NOTE: These schemas ensure that studio API requests are properly
 * validated before processing. All required fields must be present
 * and optional fields have appropriate defaults.
 */

import { z } from 'zod';
import {
  notebookIdSchema,
  languageCodeSchema,
  slideFormatSchema,
  orientationSchema,
  detailLevelSchema,
  pageNumberPositionSchema,
  VALIDATION_ERRORS,
} from './common';

/**
 * Slide type enum
 */
export const slideTypeSchema = z.enum([
  'cover',
  'toc',
  'section',
  'content',
  'key_takeaway',
  'closing',
]);

/**
 * Design theme schema
 */
export const designThemeSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '유효한 색상 코드가 아닙니다.'),
  mood: z.string().min(1).optional(),
  style: z.string().min(1).optional(),
});

export type DesignTheme = z.infer<typeof designThemeSchema>;

/**
 * Studio output type enum
 */
export const studioOutputTypeSchema = z.enum([
  'slide_deck',
  'mind_map',
  'infographic',
  'quiz',
  'report',
]);

/**
 * Slides POST request schema
 */
export const slidesPostSchema = z.object({
  notebookId: notebookIdSchema,
  format: slideFormatSchema.optional().default('detailed'),
  language: languageCodeSchema.optional().default('ko'),
  prompt: z.string().optional(),
  slideCount: z.coerce
    .number()
    .int()
    .positive()
    .max(50, '최대 50장까지 생성할 수 있습니다.')
    .optional(),
  designThemeId: z.string().optional(),
  includeCover: z.boolean().optional().default(true),
  includeBridge: z.boolean().optional().default(true),
  includePageNumber: z.boolean().optional().default(true),
  pageNumberPosition: pageNumberPositionSchema.optional().default('bottom-right'),
});

export type SlidesPostRequest = z.infer<typeof slidesPostSchema>;

/**
 * Slide item schema
 */
export const slideItemSchema = z.object({
  type: slideTypeSchema.optional(),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  content: z.string(),
});

export type SlideItem = z.infer<typeof slideItemSchema>;

/**
 * Slides outline schema
 */
export const slidesOutlineSchema = z.object({
  designTheme: designThemeSchema.optional(),
  slides: z.array(slideItemSchema).min(1, '최소 1개의 슬라이드가 필요합니다.'),
});

export type SlidesOutline = z.infer<typeof slidesOutlineSchema>;

/**
 * Mindmap POST request schema
 */
export const mindmapPostSchema = z.object({
  notebookId: notebookIdSchema,
  language: languageCodeSchema.optional().default('ko'),
  prompt: z.string().optional(),
});

export type MindmapPostRequest = z.infer<typeof mindmapPostSchema>;

/**
 * Mindmap node schema
 */
export const mindmapNodeSchema: z.ZodType<{
  topic: string;
  children?: any[];
}> = z.object({
  topic: z.string().min(1, '주제는 필수입니다.').max(50, '주제가 너무 깁습니다.'),
  children: z.array(z.lazy(() => mindmapNodeSchema)).optional(),
});

export type MindmapNode = z.infer<typeof mindmapNodeSchema>;

/**
 * Mindmap data schema
 */
export const mindmapDataSchema = z.object({
  central: z.string().min(1).max(50),
  branches: z.array(
    z.object({
      topic: z.string().min(1).max(50),
      children: z.array(mindmapNodeSchema),
    })
  ),
});

export type MindmapData = z.infer<typeof mindmapDataSchema>;

/**
 * Infographic POST request schema
 */
export const infographicPostSchema = z.object({
  notebookId: notebookIdSchema,
  language: languageCodeSchema.optional().default('ko'),
  orientation: orientationSchema.optional().default('landscape'),
  detailLevel: detailLevelSchema.optional().default('standard'),
  prompt: z.string().optional(),
  designThemeId: z.string().optional(),
});

export type InfographicPostRequest = z.infer<typeof infographicPostSchema>;

/**
 * Quiz POST request schema
 */
export const quizPostSchema = z.object({
  notebookId: notebookIdSchema,
  language: languageCodeSchema.optional().default('ko'),
  questionCount: z.coerce
    .number()
    .int()
    .positive()
    .max(50, '최대 50문제까지 생성할 수 있습니다.')
    .optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  prompt: z.string().optional(),
});

export type QuizPostRequest = z.infer<typeof quizPostSchema>;

/**
 * Report POST request schema
 */
export const reportPostSchema = z.object({
  notebookId: notebookIdSchema,
  language: languageCodeSchema.optional().default('ko'),
  format: z.enum(['markdown', 'html', 'pdf']).optional().default('markdown'),
  prompt: z.string().optional(),
});

export type ReportPostRequest = z.infer<typeof reportPostSchema>;

/**
 * Studio output status enum
 */
export const studioOutputStatusSchema = z.enum([
  'pending',
  'generating',
  'completed',
  'failed',
]);

/**
 * Studio output progress schema
 */
export const studioOutputProgressSchema = z.object({
  phase: z.string(),
  completed: z.number().int().nonnegative(),
  total: z.number().int().positive(),
  failed: z.number().int().nonnegative().optional(),
});

export type StudioOutputProgress = z.infer<typeof studioOutputProgressSchema>;

/**
 * Design theme POST schema (for saving custom themes)
 */
export const designThemePostSchema = z.object({
  name: z.string().min(1, '테마 이름은 필수입니다.').max(100),
  prompt: z.string().min(1, '프롬프트는 필수입니다.').max(2000),
  description: z.string().max(500).optional(),
  isDefault: z.boolean().optional().default(false),
});

export type DesignThemePostRequest = z.infer<typeof designThemePostSchema>;

/**
 * Theme preview POST request schema
 */
export const themePreviewPostSchema = z.object({
  notebookId: notebookIdSchema,
  themePrompt: z.string().min(1, '테마 프롬프트는 필수입니다.').max(2000),
  slideType: slideTypeSchema.optional().default('content'),
  language: languageCodeSchema.optional().default('ko'),
});

export type ThemePreviewPostRequest = z.infer<typeof themePreviewPostSchema>;
