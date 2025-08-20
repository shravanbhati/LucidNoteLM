import { NextResponse } from "next/server.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { OpenAIEmbeddings } from "@langchain/openai";

// loaders
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";

import fs from "fs/promises";
import path from "path";

const COLLECTION = "notes";

export async function POST(req) {
  let docs = [];

  // Detect if request is JSON or FormData
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    // ---- Handle PDF Upload ----
    const formData = await req.formData();
    const type = formData.get("type");

    if (type === "pdf") {
      const file = formData.get("file"); // PDF file
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Save temporarily
      const uploadPath = path.join(process.cwd(), "uploads", file.name);
      await fs.mkdir(path.dirname(uploadPath), { recursive: true });
      await fs.writeFile(uploadPath, buffer);

      // Load PDF
      const loader = new PDFLoader(uploadPath, { splitPages: true });
      docs = await loader.load();

      // Clean up temp file
      await fs.unlink(uploadPath);
    }
  } else {
    // ---- Handle JSON (web/youtube) ----
    let jsonData;
    try {
      jsonData = await req.json();
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return NextResponse.json(
        { error: "Invalid JSON data provided" },
        { status: 400 }
      );
    }

    const { type, url } = jsonData;

    if (type === "web" && url) {
      try {
        const loader = new PuppeteerWebBaseLoader(url, {
          launchOptions: { headless: true },
          gotoOptions: { waitUntil: "domcontentloaded" },
        });
        docs = await loader.load();
      } catch (error) {
        console.error("Error loading web page:", error);
        return NextResponse.json(
          { error: "Failed to process web page: " + error.message },
          { status: 400 }
        );
      }
    }

    if (type === "youtube" && url) {
      try {
        const loader = YoutubeLoader.createFromUrl(url, {
          language: "en",
          addVideoInfo: true,
        });
        docs = await loader.load();
      } catch (error) {
        console.error("Error loading YouTube video:", error);
        return NextResponse.json(
          { error: "Failed to process YouTube video: " + error.message },
          { status: 400 }
        );
      }
    }
  }

  if (!docs.length) {
    return NextResponse.json(
      { error: "No documents parsed. Check your input." },
      { status: 400 }
    );
  }

  // Split into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  // Push into Qdrant
  const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });

  await QdrantVectorStore.fromDocuments(
    splitDocs,
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
    { client, collectionName: COLLECTION }
  );

  return NextResponse.json({
    success: true,
    chunks: splitDocs.length,
  });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const identifier = decodeURIComponent(searchParams.get("id"));

  console.log(decodeURIComponent(searchParams.get("id")));

  const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });

  await client.delete(COLLECTION, {
    filter: {
      must: [
        {
          key: "metadata.source",
          match: { value: identifier },
        },
      ],
    },
  });

  return NextResponse.json({ success: true });
}
