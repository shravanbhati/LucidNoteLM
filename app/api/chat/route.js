import { NextResponse } from "next/server.js";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
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
     - Example: (<NAME>: PAGE No. <NUM>) 
    If it's from a website, include the snippet and the link.  
     - Example: [<SITE_NAME](<VALID_URL_LINK>)
    If it's from a YouTube transcript, include the timestamp and content.
     - Example: At <TIMESTAMP> ...

    You need to change the TEXT between <TEXT> with actual info, in case if you don't have info,
    for example, you don't know the pdf name then just say from attched pdf, but if name is available then always provide this info.
    
    RULES:
    - Response should always be valid Markdown.  
    - The content you have in your context needs to be converted into proper Markdown formatting.  
    - Do not change the actual content, but ensure that elements like "\n", text covered with single asterisks "*...*", etc., are converted into proper Markdown.  
     -Example: *TEXT* Convert this into **TEXT** and if "\n" is used between two words or line the next word will strat from next new line.
    - Ask for source, if user's asking something out of your context.
    - Never make up information. If the answer isn’t in the context, say you don’t know.

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
