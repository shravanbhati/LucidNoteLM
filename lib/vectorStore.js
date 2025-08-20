import { QdrantVectorStore } from "langchain/vectorstores/qdrant";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { QdrantClient } from "@qdrant/js-client-rest";

export const COLLECTION = "notes";

export async function getVectorStore() {
  const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });

  return await QdrantVectorStore.fromExistingCollection(
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
    { client, collectionName: COLLECTION }
  );
}
