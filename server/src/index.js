const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const http = require('http');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const executeRouter = require('./routes/execute');
const filesRouter = require('./routes/files');
const openaiRouter = require('./routes/openai');

// Try to import the client update utility (may not exist if this is the first run)
let updateClientBaseUrl = null;
try {
  const updateClient = require('../updateClient');
  updateClientBaseUrl = updateClient.updateClientBaseUrl;
} catch (error) {
  console.log('Client update utility not available');
}

// Initialize app
const app = express();
let PORT = process.env.PORT || 5002;
const MAX_PORT_ATTEMPTS = 10; // Try up to 10 different ports if needed

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://code-editor-client.onrender.com',
    'https://code-editor.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err.stack);
  res.status(500).json({
    error: 'An unexpected error occurred',
    message: err.message
  });
});

// Check if OpenAI API key is set - this is now redundant as we're directly providing the key
// But we'll keep it for reference and potential future environment-based configuration
if (!process.env.OPENAI_API_KEY) {
  console.warn('Notice: OPENAI_API_KEY environment variable is not set, but API key is directly provided in the code.');
}

// Routes
app.use('/api/execute', executeRouter);
app.use('/api/files', filesRouter);
app.use('/api/openai', openaiRouter);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Code Editor API Server' });
});

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Function to start server with port handling
const startServer = (port, attempt = 1) => {
  const server = http.createServer(app);
  
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying port ${port + 1}...`);
      if (attempt <= MAX_PORT_ATTEMPTS) {
        startServer(port + 1, attempt + 1);
      } else {
        console.error(`Failed to find an available port after ${MAX_PORT_ATTEMPTS} attempts.`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', error);
      process.exit(1);
    }
  });
  
  server.listen(port, () => {
    PORT = port; // Update the actual port used
    console.log(`Server running on port ${PORT}`);
    console.log(`Gemini API integration enabled with direct API key`);
    console.log(`Available routes:`);
    console.log(`- GET  /`);
    console.log(`- POST /api/execute`);
    console.log(`- POST /api/openai/analyze`);
    console.log(`- POST /api/openai/chat`);
    
    // Update the client about the port change if needed
    if (port !== 5002) {
      console.log('\n=========================================================');
      console.log(`IMPORTANT: Server is using port ${port} instead of default 5002.`);
      
      // Try to update the client configuration automatically
      if (updateClientBaseUrl) {
        const updated = updateClientBaseUrl(port);
        if (updated) {
          console.log('✓ Client API_BASE_URL has been automatically updated');
        } else {
          console.log('! Could not automatically update client API_BASE_URL');
          console.log(`You may need to update API_BASE_URL in client/src/utils/aiHelpers.js manually`);
        }
      } else {
        console.log(`You may need to update API_BASE_URL in client/src/utils/aiHelpers.js manually`);
      }
      
      console.log('=========================================================\n');
    }
  });
};

// Start the server
startServer(PORT);
