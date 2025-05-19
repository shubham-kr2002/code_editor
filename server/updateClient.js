const fs = require('fs');
const path = require('path');

/**
 * Update the API_BASE_URL in the client's aiHelpers.js file
 * 
 * @param {number} port - The port number to use
 */
function updateClientBaseUrl(port) {
  try {
    const filePath = path.join(__dirname, '..', 'client', 'src', 'utils', 'aiHelpers.js');
    
    if (!fs.existsSync(filePath)) {
      console.error(`Client file not found: ${filePath}`);
      return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the API_BASE_URL - handle both old and new formats
    let updatedContent = content;
    
    // Check for Vite format
    const vitePattern = /const API_BASE_URL = import\.meta\.env\.VITE_API_URL \|\| ['"]http:\/\/localhost:\d+['"]/;
    if (vitePattern.test(content)) {
      updatedContent = content.replace(
        vitePattern,
        `const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:${port}'`
      );
    } else {
      // Try old React format
      const reactPattern = /const API_BASE_URL = ['"]http:\/\/localhost:\d+['"]/;
      if (reactPattern.test(content)) {
        updatedContent = content.replace(
          reactPattern,
          `const API_BASE_URL = 'http://localhost:${port}'`
        );
      }
    }
    
    if (content === updatedContent) {
      console.log('No changes needed to client API base URL');
      return false;
    }
    
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated client API base URL to port ${port}`);
    return true;
  } catch (error) {
    console.error('Error updating client API base URL:', error);
    return false;
  }
}

// If this script is run directly
if (require.main === module) {
  const port = process.argv[2];
  
  if (!port || isNaN(parseInt(port))) {
    console.error('Please provide a valid port number');
    process.exit(1);
  }
  
  const updated = updateClientBaseUrl(parseInt(port));
  
  if (updated) {
    console.log('Client configuration updated successfully');
  } else {
    console.log('Client configuration update failed or was not needed');
  }
}

module.exports = { updateClientBaseUrl }; 