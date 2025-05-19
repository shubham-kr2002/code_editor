const { GoogleGenerativeAI } = require('@google/generative-ai');

// API key for Google Gemini
const apiKey = "AIzaSyB2SS_gS5eQzAhp8tZfkigP8-zxdfrzS5Y";

console.log('Starting Gemini API test...');
console.log('Using API key:', apiKey.substring(0, 5) + '...');

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log('Listing available models...');
    
    // Generate content with a different model
    console.log('Attempting to generate content with gemini-1.5-flash...');
    const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      .generateContent("Hello, can you help me with some JavaScript code?");
    
    console.log('Response received:');
    console.log(result.response.text());
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Error testing Gemini API:', error.message);
    console.error('Full error:', error);
    
    // Try a fallback model
    try {
      console.log('Trying fallback model gemini-1.0-pro...');
      const result = await genAI.getGenerativeModel({ model: "gemini-1.0-pro" })
        .generateContent("Hello, can you help me with some JavaScript code?");
      
      console.log('Response received from fallback model:');
      console.log(result.response.text());
      console.log('Fallback test completed successfully!');
    } catch (fallbackError) {
      console.error('Error with fallback model:', fallbackError.message);
      console.error('Full fallback error:', fallbackError);
    }
  }
}

// Run the test
listModels().catch(err => {
  console.error('Unhandled error in test:', err);
}); 