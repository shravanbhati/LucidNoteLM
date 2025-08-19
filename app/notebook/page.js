"use client";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/ui/prompt-input";
import {
  Message,
  MessageAvatar,
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
import { ScrollButton } from "@/components/ui/scroll-button";
import { Button } from "@/components/ui/button";
import { Square, ArrowUp, Paperclip } from "lucide-react";
import React, { useState } from "react";

const page = () => {
  // State for left panel (note input)
  const [noteInput, setNoteInput] = useState("");
  const [isNoteLoading, setIsNoteLoading] = useState(false);

  // State for right panel (chat)
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! I'm your NotebookLM assistant. How can I help you with your notes today?",
    },
  ]);

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
  const handleChatSubmit = () => {
    if (!chatInput.trim() || isChatLoading) return;

    setIsChatLoading(true);
    // Add user message to chat
    const newUserMessage = {
      id: messages.length + 1,
      role: "user",
      content: chatInput,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setChatInput("");

    // Simulate API call for chat response
    setTimeout(() => {
      const newAssistantMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: `I understand you're asking about "${chatInput}". Based on your notes, I can tell you that...`,
      };
      setMessages((prev) => [...prev, newAssistantMessage]);
      setIsChatLoading(false);
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
        <h1 className="text-2xl font-bold text-zinc-100">NotebookLM</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Note Input */}
        <div className="w-1/2 border-r border-zinc-800 flex flex-col">
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
        <div className="w-1/2 flex flex-col">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-100">
              Chat with your notes
            </h2>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatContainerRoot className="flex-1">
              <ChatContainerContent className="p-4 space-y-4">
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    className={
                      message.role === "user" ? "justify-end" : "justify-start"
                    }
                  >
                    {message.role !== "system" && (
                      <MessageAvatar
                        fallback={message.role === "user" ? "U" : "A"}
                        className={
                          message.role === "user"
                            ? "order-2 ml-2"
                            : "order-1 mr-2"
                        }
                      />
                    )}
                    <MessageContent
                      markdown={true}
                      className={
                        message.role === "user"
                          ? "bg-blue-600 text-white rounded-lg p-4"
                          : message.role === "system"
                          ? "bg-zinc-800 text-zinc-300 rounded-lg p-4"
                          : "bg-zinc-800 text-zinc-100 rounded-lg p-4"
                      }
                    >
                      {message.content}
                    </MessageContent>
                  </Message>
                ))}
                <ChatContainerScrollAnchor />
              </ChatContainerContent>
              <div className="absolute right-4 bottom-4">
                <ScrollButton className="bg-zinc-800 hover:bg-zinc-700" />
              </div>
            </ChatContainerRoot>

            <div className="p-4 border-t border-zinc-800">
              <FileUpload onFilesAdded={handleFilesAdded}>
                <div className="relative">
                  <PromptInput
                    value={chatInput}
                    onValueChange={setChatInput}
                    isLoading={isChatLoading}
                    onSubmit={handleChatSubmit}
                    className="w-full"
                  >
                    <PromptInputTextarea placeholder="Ask something about your notes..." />
                    <PromptInputActions className="justify-end pt-2">
                      <div className="flex items-center gap-2">
                        <FileUploadTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Paperclip className="size-4" />
                          </Button>
                        </FileUploadTrigger>
                        <PromptInputAction
                          tooltip={
                            isChatLoading ? "Processing..." : "Send message"
                          }
                        >
                          <Button
                            variant="default"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleChatSubmit}
                            disabled={isChatLoading}
                          >
                            <ArrowUp className="size-4" />
                          </Button>
                        </PromptInputAction>
                      </div>
                    </PromptInputActions>
                  </PromptInput>
                  <FileUploadContent className="bg-zinc-800/80" />
                </div>
              </FileUpload>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
