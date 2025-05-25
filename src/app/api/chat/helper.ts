import {
  LoadAPIKeyError,
  Message,
  Tool,
  ToolInvocation,
  tool as createTool,
} from "ai";
import {
  ChatMessage,
  ChatMessageAnnotation,
  ToolInvocationUIPart,
} from "app-types/chat";
import { extractMCPToolId } from "lib/ai/mcp/mcp-tool-id";
import { errorToString, objectFlow, toAny } from "lib/utils";
import { callMcpToolAction } from "../mcp/actions";
import { safe } from "ts-safe";
import logger from "logger";
import { defaultTools } from "lib/ai/tools";
import { AllowedMCPServer } from "app-types/mcp";
import { MANUAL_REJECT_RESPONSE_PROMPT } from "lib/ai/prompts";

export function filterToolsByMentions(
  tools: Record<string, Tool>,
  mentions: string[],
) {
  if (mentions.length === 0) {
    return tools;
  }
  return objectFlow(tools).filter((_tool, key) =>
    mentions.some((mention) => key.startsWith(mention)),
  );
}

export function filterToolsByAllowedMCPServers(
  tools: Record<string, Tool>,
  allowedMcpServers?: Record<string, AllowedMCPServer>,
): Record<string, Tool> {
  if (!allowedMcpServers) {
    return tools;
  }
  return objectFlow(tools).filter((_tool, key) => {
    const { serverName, toolName } = extractMCPToolId(key);
    if (!allowedMcpServers[serverName]?.tools) return true;
    return allowedMcpServers[serverName].tools.includes(toolName);
  });
}
export function getAllowedDefaultToolkit(
  allowedAppDefaultToolkit?: string[],
): Record<string, Tool> {
  if (!allowedAppDefaultToolkit) {
    return Object.values(defaultTools).reduce((acc, toolkit) => {
      return { ...acc, ...toolkit };
    }, {});
  }
  return allowedAppDefaultToolkit.reduce((acc, toolkit) => {
    return { ...acc, ...(defaultTools[toolkit] ?? {}) };
  }, {});
}

export function excludeToolExecution(
  tool: Record<string, Tool>,
): Record<string, Tool> {
  return objectFlow(tool).map((value) => {
    return createTool({
      parameters: value.parameters,
      description: value.description,
    });
  });
}

export function appendAnnotations(
  annotations: any[] = [],
  annotationsToAppend: ChatMessageAnnotation[] | ChatMessageAnnotation,
): ChatMessageAnnotation[] {
  const newAnnotations = Array.isArray(annotationsToAppend)
    ? annotationsToAppend
    : [annotationsToAppend];
  return [...annotations, ...newAnnotations];
}

export function mergeSystemPrompt(...prompts: (string | undefined)[]): string {
  const filteredPrompts = prompts
    .map((prompt) => prompt?.trim())
    .filter(Boolean);
  return filteredPrompts.join("\n\n");
}

export function manualToolExecuteByLastMessage(
  part: ToolInvocationUIPart,
  message: Message,
) {
  const { args, toolName } = part.toolInvocation;

  const manulConfirmation = (message.parts as ToolInvocationUIPart[]).find(
    (_part) => {
      return (
        _part.toolInvocation?.state == "result" &&
        _part.toolInvocation?.toolCallId == part.toolInvocation.toolCallId
      );
    },
  )?.toolInvocation as Extract<ToolInvocation, { state: "result" }>;

  if (!manulConfirmation?.result) return MANUAL_REJECT_RESPONSE_PROMPT;

  const toolId = extractMCPToolId(toolName);

  return safe(() => callMcpToolAction(toolId.serverName, toolId.toolName, args))
    .ifFail((error) => ({
      isError: true,
      statusMessage: `tool call fail: ${toolName}`,
      error: errorToString(error),
    }))
    .unwrap();
}

export function handleError(error: any) {
  if (LoadAPIKeyError.isInstance(error)) {
    return error.message;
  }

  logger.error(error);
  logger.error(error.name);
  return errorToString(error.message);
}

export function convertToMessage(message: ChatMessage): Message {
  return {
    ...message,
    id: message.id,
    content: "",
    role: message.role,
    parts: message.parts,
    experimental_attachments:
      toAny(message).attachments || toAny(message).experimental_attachments,
  };
}

export function extractInProgressToolPart(
  messages: Message[],
): ToolInvocationUIPart | null {
  let result: ToolInvocationUIPart | null = null;

  for (const message of messages) {
    for (const part of message.parts || []) {
      if (part.type != "tool-invocation") continue;
      if (part.toolInvocation.state == "result") continue;
      result = part as ToolInvocationUIPart;
      return result;
    }
  }
  return null;
}
export function assignToolResult(toolPart: ToolInvocationUIPart, result: any) {
  return Object.assign(toolPart, {
    toolInvocation: {
      ...toolPart.toolInvocation,
      state: "result",
      result,
    },
  });
}

export function isUserMessage(message: Message): boolean {
  return message.role == "user";
}
