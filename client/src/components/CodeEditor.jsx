import React, { useState, useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { Card } from 'antd';
import ErrorPopup from './ErrorPopup';
import { getErrorExplanation, getSuggestionFix } from '../utils/errorHandler';
import { configureMonaco, createCustomMarkers } from '../utils/monacoConfig';
import { configureAutocomplete } from '../utils/autocompleteProvider';

/**
 * CodeEditor Component
 * 
 * A Monaco-based code editor with syntax highlighting, auto-completion, and more.
 * 
 * @param {Object} props
 * @param {string} props.code - Current code to display
 * @param {string} props.language - Programming language for syntax highlighting
 * @param {function} props.onChange - Function to call when code changes
 * @param {function} props.onEditorMount - Function to call with editor instance when mounted
 * @param {boolean} props.isDarkMode - Whether dark mode is enabled
 */
const CodeEditor = ({ code, language, onChange, onEditorMount, isDarkMode }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const markersRef = useRef([]);
  
  // State for error handling
  const [error, setError] = useState(null);
  const [currentFix, setCurrentFix] = useState(null);

  // Validate code for errors
  const validateCode = (value) => {
    if (!editorRef.current) return;
    
    const model = editorRef.current.getModel();
    if (!model) return;
    
    // Get current markers (errors)
    const markers = monaco.editor.getModelMarkers({ resource: model.uri });
    
    // Filter for errors (severity 8 is error)
    const errors = markers.filter(marker => marker.severity >= 8);
    markersRef.current = errors;
    
    if (errors.length > 0) {
      // Get the first error
      const firstError = errors[0];
      
      // Set the error for display
      setError({
        message: firstError.message,
        line: firstError.startLineNumber,
        column: firstError.startColumn,
        endLine: firstError.endLineNumber,
        endColumn: firstError.endColumn,
      });
      
      // Get suggested fix
      getSuggestionFix(value, language, firstError.message)
        .then(fix => setCurrentFix(fix))
        .catch(err => console.error('Error getting suggestion fix:', err));
    } else {
      setError(null);
      setCurrentFix(null);
    }
  };
  
  // Handle applying fix suggestions
  const applyFix = () => {
    if (!editorRef.current || !currentFix) return;
    
    const editor = editorRef.current;
    if (!error) return;
    
    // Create range based on error position
    const range = new monaco.Range(
      error.line,
      error.column,
      error.endLine,
      error.endColumn
    );
    
    // Apply the fix
    editor.executeEdits('fix', [{
      range: range,
      text: currentFix,
      forceMoveMarkers: true
    }]);
    
    // Clear the error and fix
    setError(null);
    setCurrentFix(null);
  };

  useEffect(() => {
    // Configure Monaco and autocomplete once before creating editor
    configureMonaco();
    configureAutocomplete();
    
    if (containerRef.current && !editorRef.current) {
      // Create editor
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: code,
        language: language,
        theme: isDarkMode ? 'vs-dark' : 'vs',
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
        scrollBeyondLastLine: false,
        fontSize: 14,
        renderLineHighlight: 'all',
        wordWrap: 'on',
        wrappingIndent: 'same',
        suggestOnTriggerCharacters: true,
        snippetSuggestions: 'inline',
        formatOnPaste: true,
        tabSize: 2,
      });

      // Add change event listener
      editorRef.current.onDidChangeModelContent(() => {
        const newValue = editorRef.current.getValue();
        onChange(newValue);
        
        // Add a short delay before validating to avoid constant validation while typing
        setTimeout(() => {
          validateCode(newValue);
        }, 500);
      });

      // Call onEditorMount callback
      if (onEditorMount) {
        onEditorMount(editorRef.current);
      }
      
      // Initialize validation
      validateCode(code);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, []);

  // Update code value when it changes externally
  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (code !== currentValue) {
        editorRef.current.setValue(code);
        validateCode(code);
      }
    }
  }, [code]);

  // Update language when it changes
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
        validateCode(editorRef.current.getValue());
      }
    }
  }, [language]);

  // Update theme when dark mode changes
  useEffect(() => {
    if (editorRef.current) {
      monaco.editor.setTheme(isDarkMode ? 'vs-dark' : 'vs');
    }
  }, [isDarkMode]);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '100%', position: 'relative' }}
        data-testid="monaco-editor"
      />
      {error && (
        <ErrorPopup
          error={error.message}
          line={error.line}
          onClose={() => setError(null)}
          onFix={currentFix ? applyFix : null}
          fixText={currentFix ? 'Apply Fix' : null}
        />
      )}
    </div>
  );
};

export default CodeEditor; 