const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// Judge0 API endpoint (you need to set up your own Judge0 instance or use a hosted one)
const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_HOST = 'judge0-ce.p.rapidapi.com';
const JUDGE0_KEY = process.env.JUDGE0_API_KEY || 'be4084533cmsh28b07ad09f04548p10f8aejsn2957489c65a8';

// Debug logs
console.log('In execute.js - JUDGE0_API_URL:', JUDGE0_API_URL);
console.log('In execute.js - JUDGE0_KEY (partial):', JUDGE0_KEY.substring(0, 5) + '...');
console.log('In execute.js - JUDGE0_HOST:', JUDGE0_HOST);

// Language ID mapping for Judge0 API
const LANGUAGE_MAP = {
  javascript: 63,  // JavaScript Node.js
  python: 71,      // Python 3
  c: 49,
  typescript: 74,
  java: 62,        // Java
  csharp: 50,      // C#
  cpp: 54,         // C++
  php: 68,         // PHP
  ruby: 72,        // Ruby
};

// Execute code
router.post('/', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    console.log('Using Judge0 API for code execution');
    // For production, use Judge0 API
    const langId = LANGUAGE_MAP[language] || LANGUAGE_MAP.javascript;
    
    // Prepare submission to Judge0
    const submission = {
      source_code: code,
      language_id: langId,
      stdin: '',
    };

    // Submit code to Judge0
    console.log('Submitting to Judge0:', `${JUDGE0_API_URL}/submissions`);
    
    const createResponse = await fetch(`${JUDGE0_API_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': JUDGE0_KEY,
        'x-rapidapi-host': JUDGE0_HOST
      },
      body: JSON.stringify(submission),
    });

    if (!createResponse.ok) {
      console.error('Judge0 API error status:', createResponse.status);
      const errorText = await createResponse.text();
      console.error('Judge0 API error response:', errorText);
      throw new Error(`Judge0 API error: ${createResponse.status}`);
    }

    const createData = await createResponse.json();
    console.log('Judge0 submission response:', createData);
    const token = createData.token;

    // Wait for a moment to allow execution
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get results
    console.log('Fetching results for token:', token);
    const resultResponse = await fetch(`${JUDGE0_API_URL}/submissions/${token}`, {
      headers: {
        'x-rapidapi-key': JUDGE0_KEY,
        'x-rapidapi-host': JUDGE0_HOST
      },
    });

    if (!resultResponse.ok) {
      console.error('Judge0 API error getting results:', resultResponse.status);
      throw new Error(`Judge0 API error: ${resultResponse.status}`);
    }

    const resultData = await resultResponse.json();
    console.log('Judge0 results:', resultData);
    
    // Prepare response
    const response = {
      output: resultData.stdout || '',
      error: resultData.stderr || resultData.compile_output || '',
      status: resultData.status?.description || 'Unknown status',
    };

    return res.json(response);
  } catch (error) {
    console.error('Code execution error:', error);
    return res.status(500).json({ error: 'Failed to execute code: ' + error.message });
  }
});

module.exports = router; 