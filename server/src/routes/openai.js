const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Google Gemini API Integration for code analysis and debugging
 * 
 * This module provides two endpoints:
 * 1. /api/openai/analyze - Analyzes code and provides kid-friendly error explanations
 * 2. /api/openai/chat - Provides conversational assistance for coding questions
 * 
 * Note: The routes are still named 'openai' for backward compatibility with the frontend
 */

// API key for Google Gemini
const apiKey = "AIzaSyB2SS_gS5eQzAhp8tZfkigP8-zxdfrzS5Y"; // Gemini API key

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// System prompt for code analysis and debugging
const SYSTEM_PROMPT = 
  "You are a code debugger and guider for young coders. " +
  "Explain errors and code in simple, encouraging language, using analogies and avoiding jargon. " +
  "Suggest fixes clearly and provide educational tips.";

/**
 * Test endpoint to verify Gemini API connection
 */
router.get('/test', async (req, res) => {
  try {
    console.log('Testing Gemini API connection...');
    
    // Create a new Gemini model instance
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100,
      },
    });
    
    // Call Gemini API with a simple prompt
    const result = await model.generateContent("Hello, are you working?");
    const response = result.response.text();
    
    console.log('Gemini API test successful:', response.substring(0, 50) + '...');
    
    return res.json({
      status: "success",
      message: "Gemini API connection successful",
      response: response
    });
    
  } catch (error) {
    console.error('Gemini API test error:', error);
    
    return res.status(500).json({ 
      status: "error",
      error: 'Failed to connect to Gemini API: ' + (error.message || 'Unknown error')
    });
  }
});

/**
 * Analyze code and provide explanations
 * 
 * Accepts:
 * - code: The source code to analyze
 * - language: Programming language (e.g., 'python', 'javascript')
 * - context: Optional information like error messages or desired behavior
 * 
 * Returns:
 * - explanation: Kid-friendly explanation of issues or analysis
 * - suggestions: Code improvements or fixes
 * - educational_tips: Learning points related to the code
 */
router.post('/analyze', async (req, res) => {
  try {
    const { code, language, context } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }
    
    // Prepare prompt for the Gemini API with system prompt included
    const fullPrompt = `${SYSTEM_PROMPT}
    
Code in ${language}:
\`\`\`${language}
${code}
\`\`\`

${context ? `Additional context: ${context}` : ''}

Please analyze this code and provide:
1. A simple explanation of what this code does or tries to do
2. Any errors or issues in the code, explained in kid-friendly terms
3. Suggestions to improve or fix the code
4. One educational tip related to a concept in this code
`;

    // Create a new Gemini model instance
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });
    
    // Call Gemini API with combined prompt
    const result = await model.generateContent(fullPrompt);
    
    const response = result.response;
    const analysis = response.text();
    
    return res.json({
      analysis,
      model: "gemini-1.5-flash",
      usage: { total_tokens: 0 } // Gemini doesn't provide token usage in the same way
    });
    
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Handle different types of errors
    if (error.response) {
      // API error
      return res.status(error.response.status || 500).json({ 
        error: `Gemini API error: ${error.response.data?.error?.message || error.message}`
      });
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      // Network error
      return res.status(500).json({ error: 'Network error connecting to Gemini API' });
    } else if (error.code === 'ETIMEDOUT') {
      // Timeout error
      return res.status(500).json({ error: 'Request to Gemini API timed out' });
    } else {
      // Generic error
      return res.status(500).json({ 
        error: 'Failed to analyze code: ' + (error.message || 'Unknown error')
      });
    }
  }
});

/**
 * Chat endpoint for conversational coding help
 * 
 * Accepts:
 * - message: User's question or request
 * - language: Optional current programming language for context
 * - history: Optional chat history for context
 * 
 * Returns:
 * - response: AI's response to the user's message
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, language, history = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Create a new Gemini model instance
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });
    
    // Format the message with language context if provided
    const formattedMessage = language 
      ? `[User is coding in ${language}] ${message}`
      : message;
    
    // For Gemini, we need to handle history differently
    let chatHistory = [];
    
    if (history && history.length > 0) {
      // Convert history to Gemini format
      history.forEach(msg => {
        chatHistory.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });
    }
    
    // Add system prompt to the beginning if history is empty
    if (chatHistory.length === 0) {
      // We'll use generateContent instead of chat for the first message
      const result = await model.generateContent([
        SYSTEM_PROMPT,
        formattedMessage
      ]);
      
      const botResponse = result.response.text();
      
      return res.json({
        response: botResponse,
        model: "gemini-1.5-flash",
        usage: { total_tokens: 0 }
      });
    } else {
      // Start a chat session with history
      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      });
      
      // Send the message and get the response
      const result = await chat.sendMessage(formattedMessage);
      const botResponse = result.response.text();
      
      return res.json({
        response: botResponse,
        model: "gemini-1.5-flash",
        usage: { total_tokens: 0 }
      });
    }
    
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Handle different types of errors
    if (error.response) {
      // API error
      return res.status(error.response.status || 500).json({ 
        error: `Gemini API error: ${error.response.data?.error?.message || error.message}`
      });
    } else {
      // Generic error
      return res.status(500).json({ 
        error: 'Failed to process chat: ' + (error.message || 'Unknown error')
      });
    }
  }
});

module.exports = router; 