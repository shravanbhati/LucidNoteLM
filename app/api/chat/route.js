import { NextResponse } from "next/server";
import { QdrantVectorStore } from "@langchain/vectorstores/qdrant";
import { OpenAIEmbeddings } from "@langchain/embeddings/openai";
import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";

const COLLECTION = "notes";
const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: process.env.BASE_URL,
});

export async function POST(req) {
  const { query } = await req.json();

  // connect to Qdrant
  const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
    { client, collectionName: COLLECTION }
  );

  // relevant chunks
  const retriever = vectorStore.asRetriever({ k: 3 });
  const relevantChunks = await retriever.invoke(query);

  // system prompt
  const SYSTEM_PROMPT = `
    You are an AI assistant who answers user queries using ONLY the provided context.  
    If the context comes from a PDF, include the content and page number.  
    If it's from a website, include the snippet and the link.  
    If it's from a YouTube transcript, include the timestamp and content.  

    Never make up information. If the answer isn’t in the context, say you don’t know.

    CONTEXT:
    ${JSON.stringify(relevantChunks, null, 2)}
  `;

  // 4. call LLM
  const completion = await openai.chat.completions.create({
    model: process.env.MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: query },
    ],
  });

  return NextResponse.json({
    answer: completion.choices[0].message.content,
    // context: relevantChunks,
  });
}
