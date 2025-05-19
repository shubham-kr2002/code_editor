import * as monaco from 'monaco-editor';
import { configureAutocomplete } from './autocompleteProvider';

/**
 * Configure Monaco Editor for better error detection
 * and language-specific features.
 */
export const configureMonaco = () => {
  // Configure JavaScript/TypeScript validation settings
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  // Set compilation options for better error detection
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    allowJs: true,
    typeRoots: ['node_modules/@types'],
  });

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    strictNullChecks: true,
    noImplicitAny: true,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    allowJs: true,
    typeRoots: ['node_modules/@types'],
  });

  // Add custom word patterns for improved auto-completion
  monaco.languages.setLanguageConfiguration('python', {
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g
  });

  monaco.languages.setLanguageConfiguration('cpp', {
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g
  });

  // Configure Python linting settings (Monaco doesn't have built-in Python validation)
  // We can use custom markers for Python later
  
  // Configure C/C++ linting settings
  // Monaco doesn't have built-in C/C++ validation, we'll use custom markers

  // Register simple language validators
  registerCustomLanguageValidators();
  
  // Set up autocomplete providers
  configureAutocomplete();
  
  // Configure editor defaults
  monaco.editor.defineTheme('friendly-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#1e1e1e',
      'editor.foreground': '#d4d4d4',
      'editorSuggestWidget.background': '#252526',
      'editorSuggestWidget.border': '#454545',
      'editorSuggestWidget.foreground': '#d4d4d4',
      'editorSuggestWidget.highlightForeground': '#18a3ff',
      'editorSuggestWidget.selectedBackground': '#04395e',
      'editorHoverWidget.background': '#252526',
      'editorHoverWidget.border': '#454545',
    }
  });
};

/**
 * Register custom language validators for languages 
 * that don't have built-in Monaco support
 */
const registerCustomLanguageValidators = () => {
  // Python validation
  monaco.languages.registerCodeActionProvider('python', {
    provideCodeActions: function(model, range, context, token) {
      // This will be called when there are errors in Python code
      // We can provide code actions based on our errorHandler
      return {
        actions: [],
        dispose: () => {}
      };
    }
  });

  // C/C++ validation
  monaco.languages.registerCodeActionProvider('cpp', {
    provideCodeActions: function(model, range, context, token) {
      return {
        actions: [],
        dispose: () => {}
      };
    }
  });

  // PHP validation
  monaco.languages.registerCodeActionProvider('php', {
    provideCodeActions: function(model, range, context, token) {
      return {
        actions: [],
        dispose: () => {}
      };
    }
  });
};

/**
 * Create custom editor markers for languages without built-in validation
 * 
 * @param {string} code - The code to check
 * @param {string} language - Programming language
 * @param {Object} model - Monaco editor model
 * @returns {Array} Array of markers
 */
export const createCustomMarkers = (code, language, model) => {
  const markers = [];

  if (!code || !language || !model) {
    return markers;
  }

  const lines = code.split('\n');

  // Basic Python validation
  if (language === 'python') {
    // Check for indentation errors (simple check)
    let previousIndent = 0;
    lines.forEach((line, index) => {
      // Skip empty lines and comments
      if (line.trim() === '' || line.trim().startsWith('#')) {
        return;
      }

      // Check for missing colons in control structures
      if ((line.includes('if ') || line.includes('for ') || 
           line.includes('while ') || line.includes('def ') || 
           line.includes('class ')) && !line.trim().endsWith(':')) {
        markers.push({
          severity: monaco.MarkerSeverity.Error,
          message: "Missing colon ':' at the end of the statement",
          startLineNumber: index + 1,
          startColumn: 1,
          endLineNumber: index + 1,
          endColumn: line.length + 1
        });
      }

      // Very basic indentation check
      const currentIndent = line.search(/\S/);
      if (currentIndent > previousIndent + 4 && currentIndent % 4 !== 0) {
        markers.push({
          severity: monaco.MarkerSeverity.Error,
          message: "Indentation error: unexpected indent",
          startLineNumber: index + 1,
          startColumn: 1,
          endLineNumber: index + 1,
          endColumn: currentIndent + 1
        });
      }
      previousIndent = currentIndent;
    });
  }

  // Basic C/C++ validation
  if (language === 'c' || language === 'cpp') {
    // Check for missing semicolons
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      // Skip empty lines, preprocessor directives, comments, and lines that already end with semicolon/bracket
      if (trimmedLine === '' || trimmedLine.startsWith('#') || 
          trimmedLine.startsWith('//') || trimmedLine.endsWith(';') || 
          trimmedLine.endsWith('{') || trimmedLine.endsWith('}')) {
        return;
      }

      // Simple check for statements that should end with semicolons
      // This is a very basic check and won't catch all cases
      if (trimmedLine.includes('=') || 
          trimmedLine.includes('return') || 
          trimmedLine.includes('printf') || 
          trimmedLine.includes('cout')) {
        markers.push({
          severity: monaco.MarkerSeverity.Error,
          message: "Expected ';' at the end of the statement",
          startLineNumber: index + 1,
          startColumn: 1,
          endLineNumber: index + 1,
          endColumn: line.length + 1
        });
      }
    });

    // Check for printf usage without stdio.h (a common beginner mistake)
    if (code.includes('printf') && !code.includes('#include <stdio.h>')) {
      markers.push({
        severity: monaco.MarkerSeverity.Error,
        message: "Undeclared identifier 'printf'; did you forget to include <stdio.h>?",
        startLineNumber: code.split('\n').findIndex(line => line.includes('printf')) + 1,
        startColumn: 1,
        endLineNumber: code.split('\n').findIndex(line => line.includes('printf')) + 1,
        endColumn: code.split('\n')[code.split('\n').findIndex(line => line.includes('printf'))].length + 1
      });
    }
  }

  // Basic PHP validation
  if (language === 'php') {
    // Check for missing semicolons
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      // Skip empty lines, PHP tags, comments, and lines that already end with semicolon/bracket
      if (trimmedLine === '' || trimmedLine.startsWith('<?php') || 
          trimmedLine.startsWith('?>') || trimmedLine.startsWith('//') || 
          trimmedLine.endsWith(';') || trimmedLine.endsWith('{') || 
          trimmedLine.endsWith('}')) {
        return;
      }

      // Simple check for statements that should end with semicolons
      if (trimmedLine.includes('=') || 
          trimmedLine.includes('return') || 
          trimmedLine.includes('echo')) {
        markers.push({
          severity: monaco.MarkerSeverity.Error,
          message: "Parse error: syntax error, unexpected end of file, expecting ';'",
          startLineNumber: index + 1,
          startColumn: 1,
          endLineNumber: index + 1,
          endColumn: line.length + 1
        });
      }
    });

    // Check for variable usage without $
    const variablePattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;
    let match;
    let lineIndex = 0;
    
    for (const line of lines) {
      while ((match = variablePattern.exec(line)) !== null) {
        const varName = match[1];
        
        // Check if the variable is used without $ later in the code
        for (let i = lineIndex; i < lines.length; i++) {
          const usageLine = lines[i];
          const withoutDollar = new RegExp(`\\b${varName}\\b(?!\\s*=)(?!\\$)`);
          
          if (withoutDollar.test(usageLine)) {
            markers.push({
              severity: monaco.MarkerSeverity.Error,
              message: `Undefined variable: ${varName}; did you forget the '$'?`,
              startLineNumber: i + 1,
              startColumn: usageLine.indexOf(varName) + 1,
              endLineNumber: i + 1,
              endColumn: usageLine.indexOf(varName) + varName.length + 1
            });
          }
        }
      }
      lineIndex++;
    }
  }

  return markers;
}; 