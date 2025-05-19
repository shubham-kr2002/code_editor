import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Input, 
  Typography, 
  Spin, 
  Tooltip, 
  Space,
  Empty,
  List,
  Avatar,
  Divider
} from 'antd';
import {
  SendOutlined,
  CloseOutlined,
  QuestionCircleOutlined,
  BugOutlined,
  BookOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { chatWithAI, explainError, getLearningTips } from '../utils/aiHelpers';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

/**
 * AI Assistant Component
 * 
 * Provides an interface for users to get AI help with coding,
 * including error explanations, learning tips, and direct questions.
 * 
 * @param {Object} props
 * @param {string} props.code - Current code in the editor
 * @param {string} props.language - Current programming language
 * @param {string} props.error - Current error message (if any)
 * @param {function} props.onClose - Function to close the assistant
 */
const AIAssistant = ({ code, language, error, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Handle sending a message to the AI
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      setLoading(true);
      
      // Add user message to history
      const updatedHistory = [
        ...chatHistory, 
        { role: 'user', content: message }
      ];
      setChatHistory(updatedHistory);
      
      // Get AI response
      const result = await chatWithAI(message, language, chatHistory);
      
      // Add AI response to history
      setChatHistory([
        ...updatedHistory,
        { role: 'assistant', content: result.response }
      ]);
      
      setResponse(result.response);
      setMessage('');
    } catch (error) {
      console.error('AI chat error:', error);
      setResponse('Sorry, I had trouble understanding that. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle explaining errors in the code
  const handleExplainError = async () => {
    if (!code || !error) return;
    
    try {
      setLoading(true);
      const result = await explainError(code, language, error);
      setResponse(result.analysis);
      
      // Add to chat history
      setChatHistory([
        ...chatHistory,
        { role: 'user', content: `Help me fix this error: ${error}` },
        { role: 'assistant', content: result.analysis }
      ]);
    } catch (error) {
      console.error('Error explanation error:', error);
      setResponse('Sorry, I had trouble analyzing that error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle providing learning tips
  const handleGetTips = async () => {
    if (!code) return;
    
    try {
      setLoading(true);
      const result = await getLearningTips(code, language);
      setResponse(result.analysis);
      
      // Add to chat history
      setChatHistory([
        ...chatHistory,
        { role: 'user', content: 'Can you explain this code and give me learning tips?' },
        { role: 'assistant', content: result.analysis }
      ]);
    } catch (error) {
      console.error('Learning tips error:', error);
      setResponse('Sorry, I had trouble analyzing your code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format message text with proper styling
   */
  const formatMessage = (text) => {
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
                background: '#1e1e1e',
                padding: '8px',
                borderRadius: '4px',
                overflowX: 'auto',
                marginBottom: '8px',
                fontFamily: 'monospace',
                fontSize: '13px',
                border: '1px solid #444'
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
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        width: '350px',
        maxHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        overflow: 'hidden',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
    >
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <RobotOutlined style={{ marginRight: '8px' }} />
            <span>AI Coding Helper</span>
          </div>
        }
        extra={
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={onClose} 
            size="small"
          />
        }
        bordered={true}
        bodyStyle={{ 
          padding: '12px', 
          display: 'flex', 
          flexDirection: 'column',
          height: '400px'
        }}
        headStyle={{
          padding: '12px 16px'
        }}
      >
        {/* Quick action buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          marginBottom: '12px',
          padding: '8px 0',
          borderBottom: '1px solid #f0f0f0'
        }}>
          {error && (
            <Tooltip title="Explain Error">
              <Button 
                type="primary" 
                danger 
                icon={<BugOutlined />}
                onClick={handleExplainError}
                size="middle"
              >
                Fix Error
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Get Learning Tips">
            <Button 
              type="primary"
              icon={<BookOutlined />}
              onClick={handleGetTips}
              size="middle"
            >
              Learning Tips
            </Button>
          </Tooltip>
          <Tooltip title="Ask How To...">
            <Button 
              type="default"
              icon={<QuestionCircleOutlined />}
              onClick={() => setMessage(prevMsg => prevMsg + 'How do I ')}
              size="middle"
            >
              Ask How To
            </Button>
          </Tooltip>
        </div>

        {/* Chat history */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          marginBottom: '12px',
          padding: '0 4px'
        }}>
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
                    background: item.role === 'user' ? '#1677ff' : '#f5f5f5',
                    color: item.role === 'user' ? '#fff' : 'inherit',
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
                      {formatMessage(item.content)}
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
          
          {loading && (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <Spin tip="Thinking..." />
            </div>
          )}
        </div>
        
        {/* Input area */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <TextArea
            placeholder="Ask a question about your code..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{ marginRight: '8px', borderRadius: '8px' }}
          />
          <Button 
            type="primary" 
            icon={<SendOutlined />} 
            onClick={handleSendMessage}
            loading={loading}
            style={{ borderRadius: '8px', height: '40px', width: '40px', padding: 0 }}
          />
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant; 