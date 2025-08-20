"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  ArrowRight,
  FileText,
  Globe,
  Youtube,
  Sparkles,
  Brain,
  Zap,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleNavigateToNotebook = () => {
    setIsLoading(true);
    // Simulate a small delay for the loader to be visible
    setTimeout(() => {
      router.push("/notebook");
    }, 800);
  };

  // Features data
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Insights",
      description:
        "Transform your notes into actionable insights with advanced AI analysis.",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Multi-Format Support",
      description:
        "Upload PDFs, images, web pages, and YouTube videos for comprehensive analysis.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description:
        "Get instant answers to your questions with our optimized processing engine.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privacy First",
      description:
        "Your data stays private, all messages are being saved in LocalStorage.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-900 to-black text-zinc-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0">
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Animated light spots */}
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 h-96 w-96 rounded-full bg-pink-500/5 blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader variant="bars" size="lg" className="text-blue-500" />
            <p className="text-lg font-medium">Loading your notebook...</p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-32 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center rounded-full bg-zinc-800/50 px-4 py-2 text-sm font-medium backdrop-blur-sm border border-zinc-700">
              <Sparkles className="mr-2 h-4 w-4 text-blue-400" />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI-Powered Knowledge Management
              </span>
            </span>
          </div>

          <h1 className="mb-6 text-5xl font-extrabold md:text-6xl lg:text-7xl">
            <span className="block">Transform Your</span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Knowledge Into Action
            </span>
          </h1>

          <p className="mb-10 max-w-2xl text-lg text-zinc-400 md:text-xl">
            LucidNoteLM is your intelligent note-taking companion that
            understands your content and helps you discover insights through
            conversational AI.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group h-12 px-8 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 cursor-pointer"
              onClick={handleNavigateToNotebook}
              disabled={isLoading}
            >
              Start Exploring
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base border-zinc-800 bg-zinc-800 shadow-gray-900 text-zinc-200 hover:bg-zinc-800 hover:border-zinc-700 hover:text-amber-50 cursor-pointer"
            >
              Watch Demo
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Everything You Need In One Place
            </h2>
            <p className="mb-16 text-lg text-zinc-400">
              LucidNoteLM combines powerful AI with intuitive design to help you
              manage and interact with your knowledge.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 p-6 backdrop-blur-sm border border-zinc-800 transition-all hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="mb-4 text-blue-400">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Effortless Knowledge Management
            </h2>
            <p className="mb-16 text-lg text-zinc-400">
              Get started in minutes and transform how you interact with
              information.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Add Your Content</h3>
              <p className="text-zinc-400">
                Upload documents, add web pages, or paste YouTube links to build
                your knowledge base.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Ask Questions</h3>
              <p className="text-zinc-400">
                Engage with your content through our AI-powered chat interface.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Discover Insights</h3>
              <p className="text-zinc-400">
                Get intelligent responses with proper citations to original
                sources.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <div className="rounded-3xl bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 p-12 backdrop-blur-sm border border-zinc-800">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Transform Your Notes?
            </h2>
            <div className="mx-auto max-w-2xl">
              <p className="mb-8 text-lg text-zinc-400">
                Join thousands of users who have revolutionized their knowledge
                management workflow.
              </p>
            </div>
            <Button
              size="lg"
              className="h-12 px-8 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
              onClick={handleNavigateToNotebook}
              disabled={isLoading}
            >
              Get Started Now
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-zinc-500">
          <p>© {new Date().getFullYear()} LucidNoteLM. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
