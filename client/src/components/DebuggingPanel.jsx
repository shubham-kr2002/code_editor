import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Button, 
  Input, 
  Typography, 
  Tabs, 
  Spin, 
  Space,
  Collapse,
  List,
  Empty,
  Tag,
  Tooltip
} from 'antd';
import {
  BugOutlined,
  MessageOutlined,
  CloseOutlined,
  SendOutlined,
  CodeOutlined,
  ToolOutlined,
  RobotOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import * as monaco from 'monaco-editor';
import { analyzeCode, chatWithAI } from '../utils/aiHelpers';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

/**
 * DebuggingPanel Component
 * 
 * A panel for AI-driven code assistance with two main features:
 * 1. Explain Errors - Analyzes code errors and provides kid-friendly explanations
 * 2. Chat with AI - Allows conversational interaction with the AI for coding help
 * 
 * @param {Object} props
 * @param {string} props.code - Current code in the editor
 * @param {string} props.language - Current programming language
 * @param {Object} props.editorRef - Reference to Monaco editor instance
 * @param {boolean} props.isDarkMode - Whether dark mode is enabled
 */
const DebuggingPanel = ({ code, language, editorRef, isDarkMode }) => {
  // Panel state
  const [activeTab, setActiveTab] = useState('errors'); // 'chat' or 'errors'
  
  // Error analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorAnalysis, setErrorAnalysis] = useState(null);
  const [suggestedFix, setSuggestedFix] = useState(null);
  
  // Chat state
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  
  // References
  const chatContainerRef = useRef(null);
  const markersRef = useRef([]);
  
  // Scroll chat to bottom when history changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  // When the panel becomes active, analyze code
  useEffect(() => {
    if (activeTab === 'errors' && !errorAnalysis) {
      analyzeErrors();
    }
  }, [activeTab]);
  
  /**
   * Get current errors from Monaco editor
   * @returns {Array} Array of error markers
   */
  const getEditorErrors = () => {
    if (!editorRef.current) return [];
    
    const model = editorRef.current.getModel();
    if (!model) return [];
    
    // Get markers from Monaco
    const markers = monaco.editor.getModelMarkers({ resource: model.uri });
    
    // Filter for errors (severity >= 8 is error)
    return markers.filter(marker => marker.severity >= 8);
  };
  
  /**
   * Analyze code errors using AI
   */
  const analyzeErrors = async () => {
    if (!code || !language) return;
    
    try {
      setIsAnalyzing(true);
      
      // Get errors from editor
      const errors = getEditorErrors();
      markersRef.current = errors;
      
      // If no errors found by Monaco, do basic analysis
      const context = errors.length > 0
        ? `Error messages: ${errors.map(e => e.message).join(', ')}`
        : 'Check for potential issues or improvements';
      
      // Call AI API
      const result = await analyzeCode(code, language, context);
      
      // Extract fix suggestions if available
      const fixRegex = /```(?:fix|suggestion|code)?\s*(?:\w+)?\s*\n([\s\S]*?)\n```/i;
      const fixMatch = result.analysis.match(fixRegex);
      
      if (fixMatch && fixMatch[1]) {
        setSuggestedFix(fixMatch[1]);
      } else {
        setSuggestedFix(null);
      }
      
      setErrorAnalysis(result.analysis);
    } catch (error) {
      console.error('Error analyzing code:', error);
      setErrorAnalysis('Sorry, I had trouble analyzing your code. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  /**
   * Apply suggested fix to the code
   */
  const applyFix = () => {
    if (!editorRef.current || !suggestedFix) return;
    
    const editor = editorRef.current;
    
    // Insert the fix at cursor position or replace selection
    const selection = editor.getSelection();
    
    editor.executeEdits('ai-fix', [{
      range: selection,
      text: suggestedFix,
      forceMoveMarkers: true
    }]);
    
    // Focus back on editor
    editor.focus();
  };
  
  /**
   * Send a message to the AI assistant
   */
  const sendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      setIsChatLoading(true);
      
      // Add user message to chat history
      const updatedHistory = [
        ...chatHistory,
        { role: 'user', content: message }
      ];
      
      setChatHistory(updatedHistory);
      setMessage('');
      
      // Call AI API
      const result = await chatWithAI(
        message, 
        language,
        chatHistory.map(msg => ({ role: msg.role, content: msg.content }))
      );
      
      // Add AI response to chat history
      setChatHistory([
        ...updatedHistory,
        { role: 'assistant', content: result.response }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Add error message to chat
      setChatHistory([
        ...chatHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: 'Sorry, I had trouble understanding that. Please try again.' }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };
  
  /**
   * Clear chat history
   */
  const clearChat = () => {
    setChatHistory([]);
  };
  
  /**
   * Refresh error analysis
   */
  const refreshAnalysis = () => {
    setErrorAnalysis(null);
    setSuggestedFix(null);
    analyzeErrors();
  };

  /**
   * Format code analysis text with proper styling
   */
  const formatAnalysis = (text) => {
    if (!text) return null;
    
    // Split by code blocks first
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            // Code block
            const code = part.substring(3, part.length - 3).trim();
            return (
              <pre key={index} style={{ 
                background: isDarkMode ? '#1e1e1e' : '#f5f5f5',
                padding: '12px',
                borderRadius: '4px',
                overflowX: 'auto',
                marginBottom: '16px',
                fontFamily: 'monospace',
                fontSize: '14px',
                border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`
              }}>
                {code}
              </pre>
            );
          } else {
            // Regular text
            return part.split('\n').map((line, lineIndex) => (
              <Paragraph key={`${index}-${lineIndex}`} style={{ marginBottom: '8px' }}>
                {line}
              </Paragraph>
            ));
          }
        })}
      </>
    );
  };

  return (
    <Card 
      title={
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={
              <span>
                <BugOutlined /> Error Analysis
              </span>
            } 
            key="errors" 
          />
          <TabPane 
            tab={
              <span>
                <MessageOutlined /> Chat with AI
              </span>
            } 
            key="chat" 
          />
        </Tabs>
      }
      bordered={false}
      style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: isDarkMode ? '#141414' : '#fff'
      }}
      bodyStyle={{ 
        padding: '12px', 
        flex: 1, 
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
      headStyle={{
        padding: '0 12px'
      }}
    >
      {activeTab === 'errors' ? (
        // Error Analysis Tab
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              {markersRef.current.length > 0 ? (
                <Tag color="error">{markersRef.current.length} issue(s) found</Tag>
              ) : (
                <Tag color="success">No errors detected</Tag>
              )}
            </div>
            <Tooltip title="Refresh Analysis">
              <Button 
                icon={<ReloadOutlined />} 
                onClick={refreshAnalysis}
                type="text"
                loading={isAnalyzing}
              />
            </Tooltip>
          </div>
          
          <div style={{ flex: 1, overflow: 'auto', padding: '4px' }}>
            {isAnalyzing ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Spin tip="Analyzing your code..." />
              </div>
            ) : errorAnalysis ? (
              <div>
                {formatAnalysis(errorAnalysis)}
                {suggestedFix && (
                  <Button 
                    type="primary" 
                    onClick={applyFix}
                    icon={<ToolOutlined />}
                    style={{ marginTop: '16px' }}
                  >
                    Apply Suggested Fix
                  </Button>
                )}
              </div>
            ) : (
              <Empty 
                description="Click 'Analyze' to check your code for errors and get helpful suggestions" 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
              />
            )}
          </div>
        </div>
      ) : (
        // Chat Tab
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div 
            ref={chatContainerRef}
            style={{ 
              flex: 1, 
              overflow: 'auto',
              marginBottom: '12px',
              padding: '8px 4px'
            }}
          >
            {chatHistory.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={chatHistory}
                renderItem={item => (
                  <List.Item style={{ 
                    padding: '8px 0',
                    display: 'flex',
                    justifyContent: item.role === 'user' ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{ 
                      maxWidth: '80%',
                      padding: '12px',
                      borderRadius: '12px',
                      background: item.role === 'user' 
                        ? (isDarkMode ? '#1668dc' : '#1677ff') 
                        : (isDarkMode ? '#303030' : '#f5f5f5'),
                      color: item.role === 'user' 
                        ? '#fff' 
                        : (isDarkMode ? '#fff' : '#000'),
                    }}>
                      {item.role === 'assistant' && (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          marginBottom: '4px',
                          opacity: 0.7,
                          fontSize: '12px'
                        }}>
                          <RobotOutlined style={{ marginRight: '4px' }} /> AI Assistant
                        </div>
                      )}
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {formatAnalysis(item.content)}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty 
                description="Ask me anything about your code!" 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
              />
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <TextArea
              placeholder="Ask a question about your code..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              autoSize={{ minRows: 1, maxRows: 4 }}
              style={{ marginRight: '8px', borderRadius: '8px' }}
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              onClick={sendMessage}
              loading={isChatLoading}
              style={{ borderRadius: '8px', height: '40px', width: '40px', padding: 0 }}
            />
          </div>
          
          {chatHistory.length > 0 && (
            <div style={{ marginTop: '8px', textAlign: 'center' }}>
              <Button type="text" size="small" onClick={clearChat}>
                Clear Conversation
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default DebuggingPanel; 