# LucidNoteLM

LucidNoteLM is an AI-powered note-taking and knowledge management application that allows you to interact with your notes, PDFs, web pages, and YouTube videos through a conversational interface. The application uses advanced AI models and vector storage to provide intelligent responses based on your uploaded content.

[![Watch the video](https://img.youtube.com/vi/pa1_7XX5u_w/maxresdefault.jpg)](https://youtu.be/pa1_7XX5u_w)


## Features

- **AI-Powered Chat Interface**: Ask questions about your notes and get intelligent responses based on your content
- **Multi-Format Content Support**: Upload and interact with PDFs, images, web pages, and YouTube videos
- **Source Tracking**: Automatic citation of sources in responses with links to original content
- **Persistent Storage**: Local storage of chat history and sources
- **Markdown Support**: Rich text formatting in both user inputs and AI responses
- **Code Block Rendering**: Syntax-highlighted code blocks in responses
- **Responsive Design**: Works well on different screen sizes

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1. **Add Content**:

   - Enter notes directly in the left panel
   - Upload PDF files using the attachment button
   - Add web pages by entering URLs
   - Add YouTube videos by entering video URLs

2. **Interact with AI**:

   - Ask questions in the chat interface on the right panel
   - Get responses based on your uploaded content
   - See source citations for information in responses

3. **View Sources**:
   - Source citations appear below AI responses
   - Click on source tags to view details about the original content

## Technical Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **AI/ML**: OpenAI, LangChain, Qdrant vector database
- **File Processing**: PDF parsing, YouTube transcription
- **UI Components**: Custom component library with Radix UI primitives

## Environment Variables

The application requires several environment variables to be set:

- `GEMINI_API_KEY`: API key for the language model
- `BASE_URL`: Base URL for the language model API
- `QDRANT_URL`: URL for the Qdrant vector database
- `QDRANT_API_KEY`: API key for Qdrant
- `OPENAI_API_KEY`: API key for OpenAI embeddings
- `MODEL`: The specific language model to use

Create a `.env.local` file in the root directory with these variables.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [LangChain Documentation](https://docs.langchain.com/docs/) - AI application framework
- [Qdrant Documentation](https://qdrant.tech/documentation/) - Vector database for similarity search

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
