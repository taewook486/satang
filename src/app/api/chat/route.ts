import { NextResponse, NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateChatResponse } from "@/lib/ai/gemini";
import { buildSourceTexts } from "@/lib/utils/source-text";
import {
  handleApiError,
  AuthenticationError,
} from "@/lib/errors";
import { validateRequest } from "@/lib/validations/middleware";
import { chatPostSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new AuthenticationError();
    }

    // Validate request body with Zod schema
    const { notebookId, message } = await validateRequest(request, chatPostSchema);

    // Save user message
    await supabase.from("chat_messages").insert({
      notebook_id: notebookId,
      user_id: user.id,
      role: "user" as const,
      content: message,
    });

    // Get enabled sources
    const { data: sources } = await supabase
      .from("sources")
      .select("id, title, extracted_text, type")
      .eq("notebook_id", notebookId)
      .eq("is_enabled", true)
      .eq("processing_status", "completed");

    // Build context from sources
    const sourceContext = sources?.length
      ? buildSourceTexts(sources)
      : "소스가 없습니다.";

    // Get chat history
    const { data: history } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("notebook_id", notebookId)
      .order("created_at", { ascending: true })
      .limit(20);

    // Remove the last message (the one we just inserted)
    const previousMessages = (history || []).slice(0, -1);

    const systemPrompt = `당신은 Satang AI 어시스턴트입니다. 사용자가 업로드한 소스를 기반으로 질문에 답변합니다.

규칙:
- 소스 내용을 기반으로만 답변하세요.
- 소스에 없는 정보에 대해서는 "소스에서 관련 정보를 찾지 못했습니다"라고 답변하세요.
- 답변 시 관련 소스를 인용하세요 (예: [소스 1] 참고).
- 한국어로 답변하되, 사용자가 다른 언어로 질문하면 해당 언어로 답변하세요.
- 마크다운 형식을 사용하여 구조화된 답변을 제공하세요.

사용 가능한 소스:
${sourceContext}`;

    // Generate streaming response
    const stream = await generateChatResponse(
      systemPrompt,
      previousMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      message
    );

    // 스트림을 통과시키면서 전체 내용을 수집하고, 종료 시 DB에 저장
    const decoder = new TextDecoder();
    let fullContent = "";

    const passthrough = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        fullContent += decoder.decode(chunk, { stream: true });
        controller.enqueue(chunk);
      },
      async flush() {
        if (fullContent) {
          await supabase.from("chat_messages").insert({
            notebook_id: notebookId,
            user_id: user.id,
            role: "assistant" as const,
            content: fullContent,
            model: "gemini-3-flash-preview",
          });
        }
      },
    });

    return new Response(stream.pipeThrough(passthrough), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    return handleApiError(error, { route: "/api/chat" });
  }
}
