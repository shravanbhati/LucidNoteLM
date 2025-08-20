import { NextResponse } from "next/server";
import { QdrantVectorStore } from "@langchain/embeddings/openai";
import { QdrantClient } from "@qdrant/js-client-rest";

export async function POST(req) {
  const { content } = await req.json();

  const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });

  await QdrantVectorStore.fromTexts(
    [content],
    [{ type: "note" }],
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
    { client, collectionName: "notes" }
  );

  return NextResponse.json({ success: true });
}
