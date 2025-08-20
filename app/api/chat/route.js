import { NextResponse } from "next/server.js";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";

const COLLECTION = "notes";

export async function POST(req) {
  try {
    const { query } = await req.json();

    // Validate query
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Invalid query parameter" },
        { status: 400 }
      );
    }

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

    // Initialize OpenAI client with OpenRouter configuration
    let openai;
    try {
      openai = new OpenAI({
        apiKey: process.env.OPEN_ROUTER_API_KEY,
        baseURL: process.env.OPEN_ROUTER_BASE_URL,
      });
    } catch (clientError) {
      console.error("Failed to initialize OpenAI client:", clientError);
      return NextResponse.json(
        { error: "Failed to initialize AI service" },
        { status: 500 }
      );
    }

    // system prompt
    const SYSTEM_PROMPT = `
You are an AI assistant who answers user queries using ONLY the provided context. Your responses must be accurate, helpful, and based strictly on the information given.

SOURCE CITATION FORMAT:
When referencing information from the context, you MUST include proper citations in these specific formats:
- PDF sources: [<PAGE_NUMBER>](FILE_PATH)
- YT vide source: [<TITLE>](https://YTvideolink.com)
- Web sources: [<SITE_NAME>](https://url.com)

RESPONSE FORMATTING RULES:
1. Always format your response in valid Markdown
2. Preserve the original content exactly as provided in the context
3. Convert text elements properly:
   - Bold text: Convert *text* to **text**
   - Lists: Format as proper Markdown lists
   - Code blocks: Wrap in triple backticks with language identifier
4. Structure your response with appropriate headers (##, ###) for clarity when needed
5. Do not add any information that is not present in the context
6. If there is any link, wrap it like this way: [NAME](https://url.com)

RESPONSE GUIDELINES:
1. Answer the user's query directly and concisely
2. Include relevant citations immediately after the information they support
3. If multiple sources support the same point, list all relevant citations
4. If the query cannot be answered with the provided context, respond with: "I don't have enough information to answer that question based on the provided context."
5. Never make up or infer information that isn't explicitly stated in the context

CONTEXT:
${JSON.stringify(relevantChunks, null, 2)}
`;

    // Call LLM with proper error handling
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: process.env.MODEL_2,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: query },
        ],
      });
    } catch (apiError) {
      console.error("LLM API error:", apiError);
      return NextResponse.json(
        { error: "Failed to generate response from AI model" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      answer: completion.choices[0].message.content,
      // context: relevantChunks,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
