"use client";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/ui/prompt-input";
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
import { Copy } from "lucide-react";
import React, { useState } from "react";

const page = () => {
  // State for left panel (note input)
  const [noteInput, setNoteInput] = useState("");
  const [isNoteLoading, setIsNoteLoading] = useState(false);

  // State for right panel (chat)
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
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

  // State for file upload
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Handle note submission
  const handleNoteSubmit = () => {
    if (!noteInput.trim() || isNoteLoading) return;

    setIsNoteLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsNoteLoading(false);
      setNoteInput("");
      // Add a mock response to the chat
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "user",
          content: noteInput,
        },
        {
          id: prev.length + 2,
          role: "assistant",
          content:
            "I've processed your note. You can ask me questions about it in the chat panel.",
        },
      ]);
    }, 1000);
  };

  // Handle chat submission
  const handleSubmit = () => {
    if (!prompt.trim()) return;

    setPrompt("");
    setIsLoading(true);

    // Add user message immediately
    const newUserMessage = {
      id: chatMessages.length + 1,
      role: "user",
      content: prompt.trim(),
    };

    setChatMessages([...chatMessages, newUserMessage]);

    // Simulate API response
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

  // Handle file upload
  const handleFilesAdded = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    // Add a message about the uploaded files
    const fileNames = files.map((file) => file.name).join(", ");
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        role: "system",
        content: `Uploaded files: ${fileNames}`,
      },
    ]);
  };

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
            <FileUpload onFilesAdded={handleFilesAdded}>
              <div className="relative h-full flex flex-col">
                <PromptInput
                  value={noteInput}
                  onValueChange={setNoteInput}
                  isLoading={isNoteLoading}
                  onSubmit={handleNoteSubmit}
                  className="w-full"
                >
                  <PromptInputTextarea
                    placeholder="Enter your notes here..."
                    className="min-h-[200px]"
                  />
                  <PromptInputActions className="justify-between pt-4">
                    <FileUploadTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Paperclip className="size-4" />
                        Attach File
                      </Button>
                    </FileUploadTrigger>
                    <PromptInputAction
                      tooltip={isNoteLoading ? "Processing..." : "Submit note"}
                    >
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-2"
                        onClick={handleNoteSubmit}
                        disabled={isNoteLoading}
                      >
                        {isNoteLoading ? (
                          <>
                            <Square className="size-4" />
                            Stop
                          </>
                        ) : (
                          <>
                            <ArrowUp className="size-4" />
                            Submit
                          </>
                        )}
                      </Button>
                    </PromptInputAction>
                  </PromptInputActions>
                </PromptInput>
                <FileUploadContent className="bg-zinc-800/80" />
              </div>
            </FileUpload>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="font-medium text-zinc-300">Uploaded Files</h3>
              {uploadedFiles.length > 0 ? (
                <ul className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="text-sm text-zinc-400 flex items-center gap-2"
                    >
                      <Paperclip className="size-4" />
                      <span className="truncate">{file.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500">No files uploaded yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="w-1/2 flex flex-col border-zinc-800 ">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-100">
              Chat with your notes
            </h2>
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
                          <MessageContent
                            className="text-amber-50 prose w-full flex-1 rounded-lg bg-transparent p-0"
                            markdown
                          >
                            {message.content}
                          </MessageContent>
                          <MessageActions
                            className={cn(
                              "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                              isLastMessage && "opacity-100"
                            )}
                          >
                            <MessageAction tooltip="Edit" delayDuration={100}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                              >
                                <Copy />
                              </Button>
                            </MessageAction>
                          </MessageActions>
                        </div>
                      ) : (
                        <div className="group flex flex-col items-end gap-1">
                          <MessageContent className="bg-zinc-700 text-amber-50 max-w-[85%] rounded-3xl px-5 py-2.5 sm:max-w-[75%]">
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
                                className="rounded-full"
                              >
                                <Copy />
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
