/**
 * AI Helper Utilities
 * 
 * This module provides functions to interact with the Gemini API endpoints
 * for code analysis and conversational assistance.
 * 
 * Note: The endpoints still use '/api/openai/' for backward compatibility
 */

// Use environment variable for API URL with fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Analyze code using Gemini
 * 
 * Sends code to the server for analysis by AI and returns kid-friendly explanations
 * 
 * @param {string} code - The source code to analyze
 * @param {string} language - Programming language (e.g., 'python', 'javascript')
 * @param {string} context - Optional information like error messages or desired behavior
 * @returns {Promise<object>} - Analysis results including explanation and suggestions
 */
export const analyzeCode = async (code, language, context = '') => {
  try {
    console.log(`Sending analyze request for ${language} code, context: ${context.substring(0, 50)}...`);
    
    const response = await fetch(`${API_BASE_URL}/api/openai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language, context }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API returned error:', errorData);
      throw new Error(errorData.error || 'Failed to analyze code with Gemini AI');
    }
    
    const result = await response.json();
    console.log('Analysis received from Gemini, length:', result.analysis.length);
    return result;
  } catch (error) {
    console.error('Gemini code analysis error:', error);
    throw error;
  }
};

/**
 * Chat with Gemini AI about coding
 * 
 * Sends a message to the AI assistant and gets a response
 * 
 * @param {string} message - User's question or request
 * @param {string} language - Optional current programming language for context
 * @param {Array} history - Optional chat history for context
 * @returns {Promise<object>} - AI response
 */
export const chatWithAI = async (message, language = null, history = []) => {
  try {
    console.log(`Sending chat message to Gemini: "${message.substring(0, 50)}..."${history.length > 0 ? ' with history' : ''}`);
    
    const response = await fetch(`${API_BASE_URL}/api/openai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, language, history }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API returned error:', errorData);
      throw new Error(errorData.error || 'Failed to get response from Gemini AI');
    }
    
    const result = await response.json();
    console.log('Chat response received from Gemini, length:', result.response.length);
    return result;
  } catch (error) {
    console.error('Gemini chat error:', error);
    throw error;
  }
};

/**
 * Check if a code has syntax errors and get explanations
 * 
 * Uses the AI to identify and explain errors in a kid-friendly way
 * 
 * @param {string} code - The source code to check
 * @param {string} language - Programming language
 * @param {string} errorMessage - Error message from execution or compiler
 * @returns {Promise<object>} - Error analysis and suggestions
 */
export const explainError = async (code, language, errorMessage) => {
  try {
    return await analyzeCode(code, language, `Error message: ${errorMessage}`);
  } catch (error) {
    console.error('Error explanation error:', error);
    throw error;
  }
};

/**
 * Get learning tips for a code snippet
 * 
 * Provides educational tips and explanations about concepts in the code
 * 
 * @param {string} code - The source code to get tips for
 * @param {string} language - Programming language
 * @returns {Promise<object>} - Learning tips and explanations
 */
export const getLearningTips = async (code, language) => {
  try {
    return await analyzeCode(code, language, 'Please focus on educational tips and concepts explanation');
  } catch (error) {
    console.error('Learning tips error:', error);
    throw error;
  }
};

/**
 * Explain code in kid-friendly language
 * 
 * Provides step-by-step explanations of code logic, input, and output
 * 
 * @param {string} code - The source code to explain
 * @param {string} language - Programming language
 * @param {string} output - Program output (if available)
 * @param {boolean} simplified - Whether to simplify for younger users
 * @returns {Promise<object>} - Explanation and step-by-step breakdown
 */
export const explainCodeForKids = async (code, language, output = '', simplified = false) => {
  try {
    const context = `
      Please explain this code in kid-friendly language. 
      ${output ? `The output of this code is: ${output}` : ''}
      ${simplified ? 'Use very simple language for young children (age 6-9).' : 'Use language appropriate for pre-teens (age 10-13).'}
      Include a step-by-step breakdown of how the code works.
    `;
    
    return await analyzeCode(code, language, context);
  } catch (error) {
    console.error('Code explanation error:', error);
    throw error;
  }
}; 