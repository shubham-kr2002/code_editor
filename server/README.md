# Code Editor Server

This is the backend server for the Code Editor application, providing code execution, file management, and AI-powered code analysis capabilities.

## Features

- Code execution using Judge0 API
- File management (save, load, list, delete)
- OpenAI-powered code analysis and debugging help
- AI chat assistance for young coders

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the server root directory with the following variables:
   ```
   # Server Configuration
   PORT=5000

   # OpenAI API Configuration
   OPENAI_API_KEY=your_openai_api_key_here

   # Judge0 API Configuration (for code execution)
   JUDGE0_API=https://judge0-ce.p.rapidapi.com
   JUDGE0_HOST=judge0-ce.p.rapidapi.com
   JUDGE0_KEY=your_judge0_api_key_here
   ```

4. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com)
5. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Code Execution

- `POST /api/execute` - Execute code
  - Body: `{ code: string, language: string }`
  - Returns: `{ output: string, error: string, status: string }`

### File Management

- `GET /api/files` - List all files
- `GET /api/files/:filename` - Get file content
- `POST /api/files/:filename` - Save file
  - Body: `{ content: string }`
- `DELETE /api/files/:filename` - Delete file

### OpenAI Integration

- `POST /api/openai/analyze` - Analyze code and get kid-friendly explanations
  - Body: `{ code: string, language: string, context?: string }`
  - Returns: `{ analysis: string, model: string, usage: object }`

- `POST /api/openai/chat` - Chat with AI about coding questions
  - Body: `{ message: string, language?: string, history?: Array }`
  - Returns: `{ response: string, model: string, usage: object }`

## Environment Variables

- `PORT` - Server port (default: 5000)
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `JUDGE0_API` - Judge0 API endpoint for code execution
- `JUDGE0_HOST` - Judge0 API host
- `JUDGE0_KEY` - Judge0 API key 