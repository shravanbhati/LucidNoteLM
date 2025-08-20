import { NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "@langchain/text_splitter";
import { QdrantVectorStore } from "@langchain/embeddings/openai";
import { QdrantClient } from "@qdrant/js-client-rest";

// loaders
import { PDFLoader } from "@langchain/document_loaders/fs/pdf";
import { PlaywrightWebBaseLoader } from "@langchain/document_loaders/web/playwright";
import { YoutubeLoader } from "@langchain/document_loaders/web/youtube";

const COLLECTION = "notes";

export async function POST(req) {
  const { type, filePath, url } = await req.json();

  let docs = [];

  if (type === "pdf" && filePath) {
    // PDF Loader
    const loader = new PDFLoader(filePath, {
      splitPages: true, // keep page numbers
    });
    docs = await loader.load();
  }

  if (type === "web" && url) {
    // Web loader (Playwright)
    const loader = new PlaywrightWebBaseLoader(url, {
      launchOptions: { headless: true },
      gotoOptions: { waitUntil: "domcontentloaded" },
    });
    docs = await loader.load();
  }

  if (type === "youtube" && url) {
    // YouTube transcript loader
    const loader = YoutubeLoader.createFromUrl(url, {
      language: "en", // adjust if needed
      addVideoInfo: true,
    });
    docs = await loader.load();
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
    type,
  });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const identifier = searchParams.get("id"); // could be filename or url

  const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });

  // Delete all docs linked to this source
  await client.delete(COLLECTION, {
    filter: {
      must: [{ key: "metadata.source", match: { value: identifier } }],
    },
  });

  return NextResponse.json({ success: true });
}
