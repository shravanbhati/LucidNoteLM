"use client";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/ui/prompt-input";
import {
  CodeBlockGroup,
  CodeBlockCode,
  CodeBlock,
} from "@/components/ui/code-block";

import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ui/message";
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container";
import {
  FileUpload,
  FileUploadTrigger,
  FileUploadContent,
} from "@/components/ui/file-upload";
import { cn } from "@/lib/utils";
import { ScrollButton } from "@/components/ui/scroll-button";
import { Button } from "@/components/ui/button";
import { Square, ArrowUp, Paperclip } from "lucide-react";
import { Check, Copy, Save, X } from "lucide-react";
import React, { useState } from "react";

const page = () => {
  const [noteInput, setNoteInput] = useState("");
  const [isNoteLoading, setIsNoteLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messages = [
    {
      id: 1,
      role: "user",
      content: "Hello! Can you help me with a coding question?",
    },
    {
      id: 2,
      role: "assistant",
      content:
        "Of course! I'd be happy to help with your coding question. What would you like to know?",
    },
    {
      id: 3,
      role: "user",
      content: "How do I create a responsive layout with CSS Grid?",
    },
    {
      id: 4,
      role: "assistant",
      content:
        "Creating a responsive layout with CSS Grid is straightforward. Here's a basic example:\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1rem;\n}\n```\n\nThis creates a grid where:\n- Columns automatically fit as many as possible\n- Each column is at least 250px wide\n- Columns expand to fill available space\n- There's a 1rem gap between items\n\nWould you like me to explain more about how this works?",
    },
    {
      id: 5,
      role: "user",
      content: "What is the capital of France?",
    },
    {
      id: 6,
      role: "assistant",
      content: "The capital of France is Paris.",
    },
  ];
  const [chatMessages, setChatMessages] = useState(messages);
  const [files, setFiles] = useState([]);

  const [copiedIndex, setCopiedIndex] = React.useState(null);
  const [copiedKey, setCopiedKey] = React.useState(null);

  function handleMessageCopy(key, text) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  function handleCodeCopy(idx, text) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  }
  const handleFilesAdded = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleNoteSubmit = () => {
    if (!noteInput.trim() || isNoteLoading) return;

    setIsNoteLoading(true);
    setTimeout(() => {
      setIsNoteLoading(false);
      setNoteInput("");
    }, 1000);
  };

  const handleSubmit = () => {
    if (!prompt.trim()) return;

    setPrompt("");
    setIsLoading(true);

    const newUserMessage = {
      id: chatMessages.length + 1,
      role: "user",
      content: prompt.trim(),
    };

    setChatMessages([...chatMessages, newUserMessage]);

    // test responses
    setTimeout(() => {
      const assistantResponse = {
        id: chatMessages.length + 2,
        role: "assistant",
        content: `This is a response to: "${prompt.trim()}"`,
      };

      setChatMessages((prev) => [...prev, assistantResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  function parseMessage(message) {
    const parts = [];
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(message)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: message.slice(lastIndex, match.index),
        });
      }
      parts.push({
        type: "code",
        language: match[1] || "plaintext",
        content: match[2].trim(),
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < message.length) {
      parts.push({ type: "text", content: message.slice(lastIndex) });
    }

    return parts;
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-100">LucidNoteLM</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Note Input */}
        <div className="w-1/2 border-r border-zinc-800 flex flex-col ">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">
              Your Notes
            </h2>
            <FileUpload
              onFilesAdded={handleFilesAdded}
              accept=".pdf, .png, .jpg"
            >
              <div className="relative h-full flex flex-col">
                <PromptInput
                  value={noteInput}
                  onValueChange={setNoteInput}
                  isLoading={isNoteLoading}
                  onSubmit={handleNoteSubmit}
                  className="w-full bg-zinc-800 border-zinc-900"
                >
                  <PromptInputTextarea
                    placeholder="Enter your notes here..."
                    className="min-h-[200px] text-amber-50"
                  />
                  <PromptInputActions className="justify-between pt-4">
                    <PromptInputAction tooltip="Attach files">
                      <FileUploadTrigger asChild>
                        <div className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl">
                          <Paperclip className="text-amber-50 size-5" />
                        </div>
                      </FileUploadTrigger>
                    </PromptInputAction>

                    <PromptInputAction
                      tooltip={isNoteLoading ? "Saving note..." : "Save note"}
                    >
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-2 cursor-pointer"
                        onClick={handleNoteSubmit}
                        disabled={isNoteLoading}
                      >
                        {isNoteLoading ? (
                          <>
                            <Save className="size-4" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="size-4" />
                            Save
                          </>
                        )}
                      </Button>
                    </PromptInputAction>
                  </PromptInputActions>
                </PromptInput>
              </div>
            </FileUpload>
          </div>

          {/* ----- Files Panel ------ */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="font-medium text-zinc-300">Uploaded Files</h3>
              {files.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pb-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="bg-zinc-800 flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip className="size-4" />
                        <span className="max-w-[200px] truncate text-sm">
                          {file.name}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="hover:bg-zinc-600 rounded-full p-1 cursor-pointer"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <FileUploadContent>
                <div className="flex min-h-[200px] w-full items-center justify-center backdrop-blur-sm">
                  <div className="bg-background/90 m-4 w-full max-w-md rounded-lg border p-8 shadow-lg">
                    <div className="mb-4 flex justify-center">
                      <svg
                        className="text-muted size-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-center text-base font-medium">
                      Drop files to upload
                    </h3>
                    <p className="text-muted-foreground text-center text-sm">
                      Release to add files to your message
                    </p>
                  </div>
                </div>
              </FileUploadContent>
            </div>
          </div>
        </div>

        {/* ---------------- Right Panel - Chat Interface ---------------- */}
        <div className="w-1/2 flex flex-col border-zinc-800 ">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-100">Chat</h2>
          </div>

          <div className="flex h-screen flex-col overflow-hidden">
            <ChatContainerRoot className="relative flex-1 space-y-0 overflow-y-auto px-4 py-12">
              <ChatContainerContent className="space-y-12 px-4 py-12">
                {chatMessages.map((message, index) => {
                  const isAssistant = message.role === "assistant";
                  const isLastMessage = index === chatMessages.length - 1;

                  return (
                    <Message
                      key={message.id}
                      className={cn(
                        "mx-auto flex w-full max-w-3xl flex-col gap-2 px-0 md:px-6",
                        isAssistant ? "items-start" : "items-end"
                      )}
                    >
                      {isAssistant ? (
                        <div className="group flex w-full flex-col gap-0">
                          <div className="w-full flex-1 space-y-4">
                            {parseMessage(message.content).map((part, idx) =>
                              part.type === "text" ? (
                                <MessageContent
                                  key={idx}
                                  className="text-amber-50 prose w-full flex-1 rounded-lg bg-transparent p-0"
                                >
                                  {part.content}
                                </MessageContent>
                              ) : (
                                <CodeBlock
                                  className="border-zinc-800"
                                  key={idx}
                                >
                                  <CodeBlockGroup className="border-zinc-800 border-b bg-zinc-600 px-4 py-2">
                                    <div className="flex items-center gap-2">
                                      <div className="bg-zinc-900/50 font-bold text-amber-50 rounded px-2 py-1 text-xs">
                                        {part.language}
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 cursor-pointer hover:bg-zinc-600 hover:text-amber-50"
                                      onClick={() =>
                                        handleCodeCopy(idx, part.content)
                                      }
                                    >
                                      {copiedIndex === idx ? (
                                        <Check className="h-4 w-4  text-green-500" />
                                      ) : (
                                        <Copy className="h-4 w-4 text-amber-50" />
                                      )}
                                    </Button>
                                  </CodeBlockGroup>
                                  <CodeBlockCode
                                    code={part.content}
                                    language={part.language}
                                    theme="github-dark"
                                  />
                                </CodeBlock>
                              )
                            )}
                          </div>

                          <MessageActions
                            className={cn(
                              "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                              isLastMessage && "opacity-100"
                            )}
                          >
                            <MessageAction tooltip="Copy" delayDuration={100}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-zinc-600 hover:text-amber-50"
                                onClick={() =>
                                  handleMessageCopy(
                                    `assistant-${message.id}`,
                                    message.content
                                  )
                                }
                              >
                                {copiedKey === `assistant-${message.id}` ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </MessageAction>
                          </MessageActions>
                        </div>
                      ) : (
                        <div className="group flex flex-col items-end gap-1">
                          {/* User message bubble */}
                          <MessageContent className="bg-zinc-800 text-amber-50 max-w-[85%] sm:max-w-[75%] min-w-[80px] rounded-3xl px-5 py-2.5 whitespace-pre-wrap break-normal">
                            {message.content}
                          </MessageContent>
                          <MessageActions
                            className={cn(
                              "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                            )}
                          >
                            <MessageAction tooltip="Copy" delayDuration={100}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-zinc-600 hover:text-amber-50"
                                onClick={() =>
                                  handleMessageCopy(
                                    `assistant-${message.id}`,
                                    message.content
                                  )
                                }
                              >
                                {copiedKey === `assistant-${message.id}` ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </MessageAction>
                          </MessageActions>
                        </div>
                      )}
                    </Message>
                  );
                })}
              </ChatContainerContent>
              <div className="absolute right-7 bottom-4">
                <ScrollButton className="shadow-sm bg-zinc-800 border-zinc-900" />
              </div>
            </ChatContainerRoot>
            <div className="inset-x-0 bottom-0 mx-auto w-full max-w-3xl shrink-0 px-3 pb-3 md:px-5 md:pb-5">
              <PromptInput
                isLoading={isLoading}
                value={prompt}
                onValueChange={setPrompt}
                onSubmit={handleSubmit}
                className="w-full bg-zinc-800 border-zinc-900 max-w-(--breakpoint-md)"
              >
                <PromptInputTextarea
                  placeholder="Ask me anything..."
                  className="text-amber-50"
                />
                <PromptInputActions className="justify-end pt-2">
                  <PromptInputAction
                    tooltip={isLoading ? "Stop generation" : "Send message"}
                  >
                    <Button
                      variant="default"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleSubmit}
                    >
                      {isLoading ? (
                        <Square className="size-5 fill-current" />
                      ) : (
                        <ArrowUp className="size-5" />
                      )}
                    </Button>
                  </PromptInputAction>
                </PromptInputActions>
              </PromptInput>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
