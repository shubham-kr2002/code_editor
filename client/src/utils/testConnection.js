/**
 * Test connection to the Gemini API
 * 
 * This function tests the connection to the Gemini API via the server
 * and returns the result.
 * 
 * @returns {Promise<object>} - Test result with status and message
 */
export const testGeminiConnection = async () => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    console.log('Testing connection to Gemini API...');
    console.log('Using API base URL:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/api/openai/test`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API test failed:', errorData);
      return {
        success: false,
        message: errorData.error || 'Failed to connect to Gemini API',
        error: errorData
      };
    }
    
    const result = await response.json();
    console.log('Gemini API test successful:', result);
    
    return {
      success: true,
      message: 'Successfully connected to Gemini API',
      data: result
    };
  } catch (error) {
    console.error('Gemini API connection error:', error);
    return {
      success: false,
      message: `Connection error: ${error.message}`,
      error
    };
  }
}; 