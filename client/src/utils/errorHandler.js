/**
 * Error Handler Utility
 * 
 * Provides kid-friendly explanations and suggestions for common coding errors
 * across multiple programming languages.
 */

// Map of error patterns to kid-friendly explanations and fixes
const errorExplanations = {
  javascript: {
    // Syntax errors
    "Unexpected token": {
      explanation: "Oops! There's something in your code that JavaScript doesn't understand.",
      suggestion: "Check for missing brackets, quotes, or parentheses near this line."
    },
    "Expected expression": {
      explanation: "JavaScript was looking for a value or action here, but couldn't find one!",
      suggestion: "Make sure you haven't left any statements empty."
    },
    "Expected identifier": {
      explanation: "JavaScript was expecting a name for something, but couldn't find one.",
      suggestion: "Check if you missed naming a variable or function."
    },
    "Missing semicolon": {
      explanation: "You forgot a semicolon at the end of a line. Semicolons tell JavaScript when a statement is finished.",
      suggestion: "Add a semicolon (;) at the end of the line."
    },
    "Unexpected semicolon": {
      explanation: "You put a semicolon where JavaScript wasn't expecting one.",
      suggestion: "Try removing the extra semicolon."
    },
    "Undefined variable": {
      explanation: "You're trying to use a variable that hasn't been created yet.",
      suggestion: "Make sure you've declared the variable with 'let', 'const', or 'var' before using it."
    },
    "Cannot read property": {
      explanation: "You're trying to use a property of something that doesn't exist or is undefined.",
      suggestion: "Check if your object or variable exists before trying to use its properties."
    }
  },
  typescript: {
    "Type error": {
      explanation: "TypeScript expected one type but got a different type instead.",
      suggestion: "Make sure your variable types match what you're trying to do with them."
    },
    "Cannot find name": {
      explanation: "TypeScript can't find the name of something you're trying to use.",
      suggestion: "Check if you've declared the variable or imported the module you're trying to use."
    },
    "Property does not exist": {
      explanation: "You're trying to use a property that doesn't exist on this object.",
      suggestion: "Double-check the spelling or make sure the property exists on your object."
    },
  },
  python: {
    "SyntaxError": {
      explanation: "There's a mistake in how you've written your Python code.",
      suggestion: "Check for missing colons after if/for/while statements or indentation issues."
    },
    "IndentationError": {
      explanation: "Python uses spaces at the beginning of lines to organize code. Something is wrong with your spaces.",
      suggestion: "Make sure all lines inside functions or loops have the same number of spaces at the beginning."
    },
    "NameError": {
      explanation: "You're trying to use a variable or function that doesn't exist yet.",
      suggestion: "Check if you've created the variable before using it. Remember Python is case-sensitive!"
    },
    "TypeError": {
      explanation: "You're trying to do something with an object that it can't do.",
      suggestion: "Check if you're using the right type of value. For example, you can't add a number to a string without converting it."
    },
    "ImportError": {
      explanation: "Python couldn't find the module you're trying to import.",
      suggestion: "Check the spelling of the module name or make sure it's installed."
    }
  },
  cpp: {
    "expected": {
      explanation: "C++ was expecting something different in your code.",
      suggestion: "Check for missing semicolons, brackets, or parentheses."
    },
    "undeclared identifier": {
      explanation: "You're trying to use a variable that hasn't been created yet.",
      suggestion: "Make sure you've declared the variable before using it."
    },
    "no matching function": {
      explanation: "C++ couldn't find a function that matches what you're trying to call.",
      suggestion: "Check if the function name is spelled correctly and if you're passing the right number and types of arguments."
    },
    "expected ';'": {
      explanation: "You forgot a semicolon at the end of a line. Semicolons tell C++ when a statement is finished.",
      suggestion: "Add a semicolon (;) at the end of the line."
    }
  },
  php: {
    "Parse error": {
      explanation: "PHP couldn't understand part of your code.",
      suggestion: "Check for missing semicolons, brackets, or the PHP opening tag (<?php)."
    },
    "Undefined variable": {
      explanation: "You're trying to use a variable that hasn't been created yet.",
      suggestion: "Make sure you've created the variable with '$' before using it."
    },
    "Call to undefined function": {
      explanation: "You're trying to use a function that doesn't exist.",
      suggestion: "Check the spelling of the function name or if you need to include a library."
    },
    "Missing argument": {
      explanation: "You didn't provide all the required information to a function.",
      suggestion: "Check how many arguments the function needs and provide all of them."
    }
  },
  c: {
    "undeclared identifier": {
      explanation: "You're trying to use a variable that hasn't been created yet.",
      suggestion: "Make sure you've declared the variable before using it."
    },
    "expected": {
      explanation: "C was expecting something different in your code.",
      suggestion: "Check for missing semicolons, brackets, or parentheses."
    },
    "implicit declaration": {
      explanation: "You're using a function that C doesn't know about yet.",
      suggestion: "Make sure you've included the right header file for the function you're using."
    }
  }
};

/**
 * Get a kid-friendly error explanation and fix suggestion
 * 
 * @param {string} errorMessage - The error message from the compiler/interpreter
 * @param {string} language - The programming language (javascript, python, etc.)
 * @returns {Object|null} An object with explanation and suggestion, or null if no match
 */
export const getErrorExplanation = (errorMessage, language) => {
  if (!errorMessage || !language) {
    return null;
  }
  
  const languagePatterns = errorExplanations[language.toLowerCase()] || {};
  
  // Look for matches in the error patterns for the language
  for (const pattern in languagePatterns) {
    if (errorMessage.includes(pattern)) {
      return languagePatterns[pattern];
    }
  }
  
  // If no specific match, return a generic error message
  return {
    explanation: "There seems to be a problem with your code.",
    suggestion: "Check for typos, missing symbols, or other mistakes in this area."
  };
};

/**
 * Common fixes based on error type and language
 * 
 * @param {string} errorMessage - The error message from the compiler/interpreter
 * @param {string} language - The programming language (javascript, python, etc.)
 * @param {number} lineNumber - The line number where the error occurred
 * @param {string} code - The current code in the editor
 * @returns {Object|null} An object with fix details, or null if no fix available
 */
export const getSuggestionFix = (errorMessage, language, lineNumber, code) => {
  if (!errorMessage || !lineNumber || !code) {
    return null;
  }
  
  const lines = code.split('\n');
  const errorLine = lines[lineNumber - 1];
  
  if (!errorLine) {
    return null;
  }
  
  // Common fixes for JavaScript/TypeScript
  if (language === 'javascript' || language === 'typescript') {
    // Missing semicolon fix
    if (errorMessage.includes('Missing semicolon') || errorMessage.includes('expected')) {
      if (!errorLine.trim().endsWith(';') && !errorLine.trim().endsWith('{') && !errorLine.trim().endsWith('}')) {
        return {
          type: 'insert',
          text: ';',
          position: { lineNumber, column: errorLine.length + 1 }
        };
      }
    }
    
    // Undefined variable suggestion (create variable)
    if (errorMessage.includes('undefined') || errorMessage.includes('not defined')) {
      const match = errorMessage.match(/'([^']+)'/);
      if (match && match[1]) {
        const varName = match[1];
        return {
          type: 'insert',
          text: `let ${varName} = `,
          position: { lineNumber, column: 1 }
        };
      }
    }
  }
  
  // Python-specific fixes
  if (language === 'python') {
    // Missing colon for if/for/while
    if (errorMessage.includes('SyntaxError') && 
        (errorLine.includes('if ') || errorLine.includes('for ') || errorLine.includes('while ') || 
         errorLine.includes('def ') || errorLine.includes('class '))) {
      if (!errorLine.trim().endsWith(':')) {
        return {
          type: 'insert',
          text: ':',
          position: { lineNumber, column: errorLine.length + 1 }
        };
      }
    }
    
    // Indentation error
    if (errorMessage.includes('IndentationError')) {
      if (lineNumber > 1 && lines[lineNumber - 2].trim().endsWith(':')) {
        return {
          type: 'insert',
          text: '    ', // Add 4 spaces for Python indentation
          position: { lineNumber, column: 1 }
        };
      }
    }
  }
  
  // C/C++ fixes
  if (language === 'c' || language === 'cpp') {
    // Missing semicolon
    if (errorMessage.includes("expected ';'") || errorMessage.includes('expected')) {
      if (!errorLine.trim().endsWith(';') && !errorLine.trim().endsWith('{') && !errorLine.trim().endsWith('}')) {
        return {
          type: 'insert',
          text: ';',
          position: { lineNumber, column: errorLine.length + 1 }
        };
      }
    }
    
    // Include suggestion for undefined functions
    if (errorMessage.includes('undeclared identifier') && errorMessage.includes('printf')) {
      return {
        type: 'insert',
        text: '#include <stdio.h>\n',
        position: { lineNumber: 1, column: 1 }
      };
    }
  }
  
  // PHP fixes
  if (language === 'php') {
    // Missing semicolon
    if (errorMessage.includes('Parse error') || errorMessage.includes('syntax error')) {
      if (!errorLine.trim().endsWith(';') && !errorLine.trim().endsWith('{') && !errorLine.trim().endsWith('}')) {
        return {
          type: 'insert',
          text: ';',
          position: { lineNumber, column: errorLine.length + 1 }
        };
      }
    }
    
    // Missing $ for variable
    const varMatch = errorLine.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b(?!\s*=)/);
    if (errorMessage.includes('Undefined variable') && varMatch && !errorLine.includes('$' + varMatch[1])) {
      return {
        type: 'replace',
        text: '$' + varMatch[1],
        range: {
          startLineNumber: lineNumber,
          startColumn: errorLine.indexOf(varMatch[1]) + 1,
          endLineNumber: lineNumber,
          endColumn: errorLine.indexOf(varMatch[1]) + varMatch[1].length + 1
        }
      };
    }
  }
  
  return null;
}; 