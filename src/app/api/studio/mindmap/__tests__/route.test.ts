/**
 * Characterization tests for Studio MindMap API
 *
 * These tests capture the CURRENT BEHAVIOR of the mindmap generation API.
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

vi.mock('@/lib/ai/gemini', () => ({
  generateText: vi.fn(),
}));

vi.mock('@/lib/utils/source-text', () => ({
  buildSourceTexts: vi.fn(() => 'Mocked source texts'),
}));

import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { generateText } from '@/lib/ai/gemini';

describe('Studio MindMap API - Characterization Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/studio/mindmap', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Arrange: Mock unauthenticated user
      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        },
      } as any);

      const request = new NextRequest('http://localhost:3000/api/studio/mindmap', {
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
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('should return 400 when notebookId is missing', async () => {
      // Arrange: Mock authenticated user
      const mockUser = { id: 'test-user-id' };
      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
        },
      } as any);

      const request = new NextRequest('http://localhost:3000/api/studio/mindmap', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert: Characterize actual behavior
      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: '노트북 ID가 필요합니다.',
      });
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

      const request = new NextRequest('http://localhost:3000/api/studio/mindmap', {
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
        error: '활성화된 소스가 없습니다.',
      });
    });

    // SKIP: This test requires after() which doesn't work in Vitest environment
    // after() requires Next.js request context - test environment limitation
    it.skip('should create studio output record with type "mind_map"', async () => {
      // Arrange: Mock authenticated user with sources
      const mockUser = { id: 'test-user-id' };
      const mockSources = [
        { id: 'source-1', title: 'Test', extracted_text: 'Content' },
      ];
      const mockOutput = {
        id: 'output-id',
        notebook_id: 'test-notebook-id',
        user_id: 'test-user-id',
        type: 'mind_map',
        title: expect.stringContaining('마인드맵'),
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
      } as any);

      const request = new NextRequest('http://localhost:3000/api/studio/mindmap', {
        method: 'POST',
        body: JSON.stringify({
          notebookId: 'test-notebook-id',
          language: 'ko',
          prompt: 'test prompt',
        }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert: Characterize actual behavior
      expect(insertMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'mind_map',
          generation_status: 'generating',
        })
      );
      expect(response.status).toBe(200);
      expect(data).toEqual({
        id: 'output-id',
        status: 'generating',
      });
    });

    it('should return 500 when internal error occurs', async () => {
      // Arrange: Mock error in database
      vi.mocked(createServerSupabaseClient).mockImplementation(() => {
        throw new Error('Database connection error');
      });

      const request = new NextRequest('http://localhost:3000/api/studio/mindmap', {
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
      expect(data).toEqual({ error: 'Internal server error' });
    });
  });
});
