"use client";

import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PromptInput from "./prompt-input";
import clsx from "clsx";
import { appStore } from "@/app/store";
import { cn, generateUUID, truncateString } from "lib/utils";
import { ErrorMessage, PreviewMessage } from "./message";
import { Greeting } from "./greeting";

import { useShallow } from "zustand/shallow";
import { UIMessage } from "ai";

import { safe } from "ts-safe";
import { mutate } from "swr";
import {
  ChatApiSchemaRequestBody,
  ChatMessageAnnotation,
} from "app-types/chat";
import { useLatest } from "@/hooks/use-latest";
import { isShortcutEvent, Shortcuts } from "lib/keyboard-shortcuts";
import { Button } from "ui/button";
import { deleteThreadAction } from "@/app/api/chat/actions";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "ui/dialog";

type Props = {
  threadId: string;
  initialMessages: Array<UIMessage>;
  selectedChatModel?: string;
  slots?: {
    emptySlot?: ReactNode;
    inputBottomSlot?: ReactNode;
  };
};

export default function ChatBot({ threadId, initialMessages, slots }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [
    appStoreMutate,
    model,
    toolChoice,
    allowedAppDefaultToolkit,
    allowedMcpServers,
  ] = appStore(
    useShallow((state) => [
      state.mutate,
      state.model,
      state.toolChoice,
      state.allowedAppDefaultToolkit,
      state.allowedMcpServers,
    ]),
  );

  const {
    messages,
    input,
    setInput,
    append,
    status,
    reload,
    setMessages,
    addToolResult,
    error,
    stop,
  } = useChat({
    id: threadId,
    api: "/api/chat",
    initialMessages,
    experimental_prepareRequestBody: ({ messages }) => {
      const lastMessage = messages.at(-1)!;
      vercelAISdkV4ToolInvocationIssueCatcher(lastMessage);
      const request: ChatApiSchemaRequestBody = {
        id: latestRef.current.threadId,
        model: latestRef.current.model,
        toolChoice: latestRef.current.toolChoice,
        allowedAppDefaultToolkit: latestRef.current.allowedAppDefaultToolkit,
        allowedMcpServers: latestRef.current.allowedMcpServers,
        message: lastMessage,
      };
      return request;
    },
    sendExtraMessageFields: true,
    generateId: generateUUID,
    experimental_throttle: 100,
    onFinish() {
      const chatPath = `/chat/${threadId}`;
      if (window.location.pathname !== chatPath) {
        window.history.replaceState({}, "", chatPath);
        mutate("threads");
      }
    },
    onError: (error) => {
      toast.error(
        truncateString(error.message, 100) ||
          "An error occured, please try again!",
      );
    },
  });

  const [isDeleteThreadPopupOpen, setIsDeleteThreadPopupOpen] = useState(false);

  const latestRef = useLatest({
    toolChoice,
    model,
    allowedAppDefaultToolkit,
    allowedMcpServers,
    messages,
    threadId,
  });

  const isLoading = useMemo(
    () => status === "streaming" || status === "submitted",
    [status],
  );

  const emptyMessage = useMemo(
    () => messages.length === 0 && !error,
    [messages.length, error],
  );

  const isInitialThreadEntry = useMemo(
    () =>
      initialMessages.length > 0 &&
      initialMessages.at(-1)?.id === messages.at(-1)?.id,
    [initialMessages, messages],
  );

  const needSpaceClass = useCallback(
    (index: number) => {
      if (error || isInitialThreadEntry || index != messages.length - 1)
        return false;
      const message = messages[index];
      if (message.role === "user") return false;
      return true;
    },
    [messages, error],
  );

  const [isExecutingProxyToolCall, setIsExecutingProxyToolCall] =
    useState(false);

  const isPendingToolCall = useMemo(() => {
    if (status != "ready") return false;
    const lastMessage = messages.at(-1);
    if (lastMessage?.role != "assistant") return false;
    const annotation = lastMessage.annotations?.at(-1) as ChatMessageAnnotation;
    if (annotation?.toolChoice != "manual") return false;
    const lastPart = lastMessage.parts.at(-1);
    if (lastPart?.type != "tool-invocation") return false;
    if (lastPart.toolInvocation.state != "call") return false;
    return true;
  }, [status, messages]);

  const proxyToolCall = useCallback(
    (answer: boolean) => {
      if (!isPendingToolCall) throw new Error("Tool call is not supported");
      setIsExecutingProxyToolCall(true);
      return safe(async () => {
        const lastMessage = messages.at(-1)!;
        const lastPart = lastMessage.parts.at(-1)! as Extract<
          UIMessage["parts"][number],
          { type: "tool-invocation" }
        >;
        return addToolResult({
          toolCallId: lastPart.toolInvocation.toolCallId,
          result: answer,
        });
      })
        .watch(() => setIsExecutingProxyToolCall(false))
        .unwrap();
    },
    [isPendingToolCall, addToolResult],
  );

  useEffect(() => {
    appStoreMutate({ currentThreadId: threadId });
    return () => {
      appStoreMutate({ currentThreadId: null });
    };
  }, [threadId]);

  useEffect(() => {
    if (isInitialThreadEntry)
      containerRef.current?.scrollTo({
        top: containerRef.current?.scrollHeight,
        behavior: "instant",
      });
  }, [isInitialThreadEntry]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const messages = latestRef.current.messages;
      if (messages.length === 0) return;
      const isLastMessageCopy = isShortcutEvent(e, Shortcuts.lastMessageCopy);
      const isDeleteThread = isShortcutEvent(e, Shortcuts.deleteThread);
      if (!isDeleteThread && !isLastMessageCopy) return;
      e.preventDefault();
      e.stopPropagation();
      if (isLastMessageCopy) {
        const lastMessage = messages.at(-1);
        const lastMessageText = lastMessage!.parts
          .filter((part) => part.type == "text")
          ?.at(-1)?.text;
        if (!lastMessageText) return;
        navigator.clipboard.writeText(lastMessageText);
        toast.success("Last message copied to clipboard");
      }
      if (isDeleteThread) {
        setIsDeleteThreadPopupOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={cn(
        emptyMessage && "justify-center pb-24",
        "flex flex-col min-w-0 relative h-full",
      )}
    >
      {emptyMessage ? (
        slots?.emptySlot ? (
          slots.emptySlot
        ) : (
          <Greeting />
        )
      ) : (
        <>
          <div
            className={"flex flex-col gap-2 overflow-y-auto py-6"}
            ref={containerRef}
          >
            {messages.map((message, index) => {
              const isLastMessage = messages.length - 1 === index;
              return (
                <PreviewMessage
                  threadId={threadId}
                  messageIndex={index}
                  key={index}
                  message={message}
                  status={status}
                  onPoxyToolCall={
                    isLastMessage &&
                    isPendingToolCall &&
                    !isExecutingProxyToolCall
                      ? proxyToolCall
                      : undefined
                  }
                  isLoading={isLoading || isPendingToolCall}
                  isError={!!error && isLastMessage}
                  isLastMessage={isLastMessage}
                  setMessages={setMessages}
                  reload={reload}
                  className={needSpaceClass(index) ? "min-h-[55dvh]" : ""}
                />
              );
            })}
            {status === "submitted" && messages.at(-1)?.role === "user" && (
              <div className="min-h-[calc(55dvh-56px)]" />
            )}
            {error && <ErrorMessage error={error} />}
            <div className="min-w-0 min-h-52" />
          </div>
        </>
      )}
      <div className={clsx(messages.length && "absolute bottom-14", "w-full")}>
        <PromptInput
          input={input}
          append={append}
          setInput={setInput}
          isLoading={isLoading || isPendingToolCall}
          onStop={stop}
        />
        {slots?.inputBottomSlot}
      </div>
      <DeleteThreadPopup
        threadId={threadId}
        onClose={() => setIsDeleteThreadPopupOpen(false)}
        open={isDeleteThreadPopupOpen}
      />
    </div>
  );
}

function vercelAISdkV4ToolInvocationIssueCatcher(message: UIMessage) {
  if (message.role != "assistant") return;
  const lastPart = message.parts.at(-1);
  if (lastPart?.type != "tool-invocation") return;
  if (!message.toolInvocations)
    message.toolInvocations = [lastPart.toolInvocation];
}

function DeleteThreadPopup({
  threadId,
  onClose,
  open,
}: { threadId: string; onClose: () => void; open: boolean }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const handleDelete = useCallback(() => {
    setIsDeleting(true);
    safe(() => deleteThreadAction(threadId))
      .watch(() => setIsDeleting(false))
      .ifOk(() => {
        toast.success("Thread deleted successfully");
        router.push("/");
      })
      .ifFail(() => toast.error("Failed to delete thread"))
      .watch(() => onClose());
  }, [threadId, router]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Chat</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this Chat thread?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} autoFocus>
            Delete
            {isDeleting && <Loader className="size-3.5 ml-2 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
