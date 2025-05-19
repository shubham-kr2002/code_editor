# CodeMentor - Online Code Editor for Young Learners

A beginner-friendly online code editor built with React, Tailwind CSS, and Node.js, designed to help young learners practice coding in multiple languages.

## Features

- Monaco Editor integration for a professional coding experience
- Support for multiple programming languages
- Real-time code execution using Judge0 API
- Responsive design suitable for various devices
- AI-powered code assistance with Gemini API
- File saving and management capabilities
- Docker support for easy deployment

## Project Structure

```
code-editor/
├── client/                 # React frontend
│   ├── public/             # Static files
│   ├── src/                # Source files
│   │   ├── components/     # React components
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Entry point
│   ├── Dockerfile          # Frontend Docker configuration
│   ├── .dockerignore       # Docker ignore file for frontend
│   ├── index.html          # HTML template
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js backend
│   ├── src/                # Source files
│   │   ├── routes/         # API routes
│   │   └── index.js        # Server entry point
│   ├── Dockerfile          # Backend Docker configuration
│   ├── .dockerignore       # Docker ignore file for backend
│   └── package.json        # Backend dependencies
├── docker-compose.yml      # Docker Compose configuration
├── render.yaml             # Render deployment configuration
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/code-editor.git
   cd code-editor
   ```

2. Install frontend dependencies:
   ```
   cd client
   npm install
   ```

3. Install backend dependencies:
   ```
   cd ../server
   npm install
   ```

4. Create a `.env` file in the server directory:
   ```
   PORT=5000
   GEMINI_API_KEY=AIzaSyB2SS_gS5eQzAhp8tZfkigP8-zxdfrzS5Y
   JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
   JUDGE0_API_KEY=be4084533cmsh28b07ad09f04548p10f8aejsn2957489c65a8
   ```

### Running Locally without Docker

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd client
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Running with Docker Compose

### Build and Run

From the project root directory, run:
```
docker compose up --build
```

This will build and start both the frontend and backend services.

### Services and Ports

- **Frontend (code-editor-client):**
  - Runs a lightweight Node.js server (serve) to host the static files
  - Exposes port `3000` (accessible at `http://localhost:3000`)
- **Backend (code-editor-server):**
  - Runs the Node.js/Express backend server
  - Exposes port `5000` (accessible at `http://localhost:5000`)

### Environment Variables

The Docker Compose setup includes the following environment variables:

- **Frontend:**
  - `VITE_API_URL`: URL for the backend API (default: http://localhost:5000)

- **Backend:**
  - `PORT`: Server port (default: 5000)
  - `GEMINI_API_KEY`: API key for Gemini AI
  - `JUDGE0_API_URL`: URL for Judge0 API
  - `JUDGE0_API_KEY`: API key for Judge0

### Testing APIs

After starting the containers, test the connection to the APIs:
1. Open the application at http://localhost:3000
2. Use the API Connection Test button to verify Gemini API connectivity
3. Try running a simple program to verify Judge0 API connectivity

## Deploying to Render

### Automatic Deployment with render.yaml

1. Fork this repository to your GitHub account
2. Connect your GitHub account to Render
3. Create a new Blueprint instance on Render, pointing to your fork
4. Render will automatically detect the `render.yaml` file and provision:
   - A web service for the frontend
   - A web service for the backend

### Manual Deployment

#### Backend Service

1. Create a new Web Service on Render
2. Connect to your GitHub repository
3. Choose "Docker" as the runtime
4. Set the Docker context path to `./server`
5. Configure the following environment variables:
   - `PORT`: 5000
   - `GEMINI_API_KEY`: Your Gemini API key
   - `JUDGE0_API_URL`: https://judge0-ce.p.rapidapi.com
   - `JUDGE0_API_KEY`: Your Judge0 API key
6. Deploy the service

#### Frontend Service

1. Create another Web Service on Render
2. Connect to the same GitHub repository
3. Choose "Docker" as the runtime
4. Set the Docker context path to `./client`
5. Configure the environment variable:
   - `VITE_API_URL`: URL of your backend service (https://your-backend-service.onrender.com)
6. Deploy the service

## Pushing to Docker Hub

To push your images to Docker Hub:

1. Build the images locally:
   ```
   docker build -t yourusername/code-editor-client:latest ./client
   docker build -t yourusername/code-editor-server:latest ./server
   ```

2. Push to Docker Hub:
   ```
   docker push yourusername/code-editor-client:latest
   docker push yourusername/code-editor-server:latest
   ```

## License

This project is licensed under the MIT License. 
