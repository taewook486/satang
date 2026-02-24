/**
 * Characterization tests for Studio Slides API
 *
 * These tests capture the CURRENT BEHAVIOR of the slides generation API.
 * They document what the system actually does, not what it should do.
 *
 * Purpose: Preserve existing behavior before refactoring
 */

import { POST } from '../route';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn(),
  createServiceRoleClient: vi.fn(),
}));

vi.mock('@/lib/ai/nano-banana', () => ({
  generateSlideImage: vi.fn(),
}));

vi.mock('@/lib/ai/gemini', () => ({
  generateText: vi.fn(),
}));

vi.mock('@/lib/utils/source-text', () => ({
  buildSourceTexts: vi.fn(() => 'Mocked source texts'),
}));

import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { generateSlideImage } from '@/lib/ai/nano-banana';
import { generateText } from '@/lib/ai/gemini';

describe('Studio Slides API - Characterization Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/studio/slides', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Arrange: Mock unauthenticated user
      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        },
      } as any);

      const request = new NextRequest('http://localhost:3000/api/studio/slides', {
        method: 'POST',
        body: JSON.stringify({
          notebookId: 'test-notebook-id',
        }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert: Characterize actual behavior
      expect(response.status).toBe(401);
      expect(data).toEqual({
        error: {
          code: 'AUTH_ERROR',
          message: 'Unauthorized'
        }
      });
    });

    it('should return 400 when notebookId is missing', async () => {
      // Arrange: Mock authenticated user
      const mockUser = { id: 'test-user-id' };
      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
        },
      } as any);

      const request = new NextRequest('http://localhost:3000/api/studio/slides', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert: Characterize actual behavior
      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
      expect(data.error.code).toBe('VALIDATION_ERROR');
      expect(data.error.message).toContain('Invalid input');
    });

    it('should return 400 when no enabled sources exist', async () => {
      // Arrange: Mock authenticated user with no sources
      const mockUser = { id: 'test-user-id' };
      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [],
                }),
              }),
            }),
          }),
        }),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/studio/slides', {
        method: 'POST',
        body: JSON.stringify({
          notebookId: 'test-notebook-id',
        }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert: Characterize actual behavior
      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: {
          code: 'VALIDATION_ERROR',
          message: '활성화된 소스가 없습니다.'
        }
      });
    });

    // SKIP: This test requires after() which doesn't work in Vitest environment
    // after() requires Next.js request context - test environment limitation
    it.skip('should create studio output record with generating status', async () => {
      // Arrange: Mock authenticated user with sources
      const mockUser = { id: 'test-user-id' };
      const mockSources = [
        { id: 'source-1', title: 'Test', extracted_text: 'Content' },
      ];
      const mockOutput = {
        id: 'output-id',
        notebook_id: 'test-notebook-id',
        user_id: 'test-user-id',
        type: 'slide_deck',
        title: expect.stringContaining('슬라이드'),
      };

      const fromMock = vi.fn();
      const insertMock = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockOutput,
            error: null,
          }),
        }),
      });
      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockSources,
            }),
          }),
        }),
      });

      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
        },
        from: fromMock,
      } as any);

      fromMock.mockImplementation((table: string) => {
        if (table === 'sources') {
          return { select: selectMock };
        }
        return { insert: insertMock };
      });

      vi.mocked(createServiceRoleClient).mockResolvedValue({
        from: vi.fn(),
        storage: vi.fn(),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/studio/slides', {
        method: 'POST',
        body: JSON.stringify({
          notebookId: 'test-notebook-id',
          format: 'detailed',
          language: 'ko',
          prompt: 'test prompt',
          slideCount: 5,
        }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert: Characterize actual behavior
      expect(insertMock).toHaveBeenCalledWith(
        expect.objectContaining({
          notebook_id: 'test-notebook-id',
          user_id: 'test-user-id',
          type: 'slide_deck',
          generation_status: 'generating',
        })
      );
      expect(response.status).toBe(200);
      expect(data).toEqual({
        id: 'output-id',
        status: 'generating',
      });
    });

    it('should return 500 when studio output record creation fails', async () => {
      // Arrange: Mock database insertion error
      const mockUser = { id: 'test-user-id' };
      const mockSources = [
        { id: 'source-1', title: 'Test', extracted_text: 'Content' },
      ];

      const fromMock = vi.fn();
      const insertMock = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }),
      });
      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockSources,
            }),
          }),
        }),
      });

      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
        },
        from: fromMock,
      } as any);

      fromMock.mockImplementation((table: string) => {
        if (table === 'sources') {
          return { select: selectMock };
        }
        return { insert: insertMock };
      });

      const request = new NextRequest('http://localhost:3000/api/studio/slides', {
        method: 'POST',
        body: JSON.stringify({
          notebookId: 'test-notebook-id',
        }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert: Characterize actual behavior
      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
      expect(data.error.code).toBe('INTERNAL_ERROR');
      expect(data.error.message).toBe('출력 레코드 생성 실패');
    });

    it('should return 500 when internal error occurs', async () => {
      // Arrange: Mock error in database
      vi.mocked(createServerSupabaseClient).mockImplementation(() => {
        throw new Error('Database connection error');
      });

      const request = new NextRequest('http://localhost:3000/api/studio/slides', {
        method: 'POST',
        body: JSON.stringify({
          notebookId: 'test-notebook-id',
        }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert: Characterize actual behavior
      expect(response.status).toBe(500);
      expect(data).toEqual({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Database connection error'
        }
      });
    });

    it('should use default values for optional parameters', async () => {
      // Arrange: Mock authenticated user
      const mockUser = { id: 'test-user-id' };
      const mockSources = [
        { id: 'source-1', title: 'Test', extracted_text: 'Content' },
      ];
      const mockOutput = { id: 'output-id' };

      const fromMock = vi.fn();
      const insertMock = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockOutput,
            error: null,
          }),
        }),
      });
      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockSources,
            }),
          }),
        }),
      });

      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
        },
        from: fromMock,
      } as any);

      fromMock.mockImplementation((table: string) => {
        if (table === 'sources') {
          return { select: selectMock };
        }
        return { insert: insertMock };
      });

      vi.mocked(createServiceRoleClient).mockResolvedValue({
        from: vi.fn(),
        storage: vi.fn(),
      } as any);

      const request = new NextRequest('http://localhost:3000/api/studio/slides', {
        method: 'POST',
        body: JSON.stringify({
          notebookId: 'test-notebook-id',
        }),
      });

      // Act
      await POST(request);

      // Assert: Characterize actual behavior - default values
      expect(insertMock).toHaveBeenCalledWith(
        expect.objectContaining({
          settings: expect.objectContaining({
            includeCover: true,
            includeBridge: true,
            includePageNumber: true,
            pageNumberPosition: 'bottom-right',
          }),
        })
      );
    });
  });
});
