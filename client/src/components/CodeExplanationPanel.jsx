import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Divider, 
  Spin, 
  Switch, 
  Collapse,
  Space,
  Tooltip
} from 'antd';
import {
  BookOutlined,
  BulbOutlined,
  SmileOutlined,
  ReloadOutlined,
  UpOutlined,
  DownOutlined
} from '@ant-design/icons';
import { explainCodeForKids } from '../utils/aiHelpers';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

/**
 * CodeExplanationPanel Component
 * 
 * A panel that provides kid-friendly explanations of code logic, input, and output.
 * Features include:
 * - Overall code explanation
 * - Step-by-step breakdown with analogies
 * - Simplify option for younger users
 * 
 * Now optimized for vertical layout on the right side.
 * 
 * @param {Object} props
 * @param {string} props.code - Current code in the editor
 * @param {string} props.language - Current programming language
 * @param {string} props.output - Output from code execution
 * @param {boolean} props.isDarkMode - Whether dark mode is enabled
 */
const CodeExplanationPanel = ({ code, language, output, isDarkMode }) => {
  // State
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [simplified, setSimplified] = useState(false);
  const [showStepByStep, setShowStepByStep] = useState(true);
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  
  // Get explanation when code runs or simplified mode changes
  useEffect(() => {
    if (code && output && isPanelExpanded) {
      getExplanation();
    }
  }, [output, simplified, isPanelExpanded]);
  
  /**
   * Get code explanation from AI API
   */
  const getExplanation = async () => {
    if (!code || !language) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await explainCodeForKids(code, language, output, simplified);
      
      // Parse explanation to separate overall explanation from step-by-step
      const fullExplanation = result.analysis;
      let overallExplanation = fullExplanation;
      let stepByStep = '';
      
      // Look for step-by-step section markers
      const stepByStepRegex = /step[-\s]by[-\s]step|breakdown|line[-\s]by[-\s]line/i;
      const parts = fullExplanation.split(new RegExp(`(${stepByStepRegex.source})`, 'i'));
      
      if (parts.length > 1) {
        // Find the index where the step-by-step section starts
        const stepByStepIndex = parts.findIndex((part, index) => 
          stepByStepRegex.test(part) && index < parts.length - 1
        );
        
        if (stepByStepIndex !== -1) {
          overallExplanation = parts.slice(0, stepByStepIndex).join('');
          stepByStep = parts.slice(stepByStepIndex).join('');
        }
      }
      
      setExplanation({
        overall: overallExplanation.trim(),
        stepByStep: stepByStep.trim() || "Let's break it down step by step:\n\n" + fullExplanation
      });
    } catch (err) {
      console.error('Error getting explanation:', err);
      setError('Sorry, I had trouble explaining this code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Toggle simplified mode for younger users
   */
  const toggleSimplified = () => {
    setSimplified(!simplified);
  };
  
  /**
   * Toggle step-by-step breakdown visibility
   */
  const toggleStepByStep = () => {
    setShowStepByStep(!showStepByStep);
  };
  
  /**
   * Toggle panel expansion
   */
  const togglePanelExpansion = () => {
    setIsPanelExpanded(!isPanelExpanded);
    
    // If expanding and we don't have an explanation yet, get one
    if (!isPanelExpanded && !explanation && code && output) {
      getExplanation();
    }
  };
  
  /**
   * Format explanation text with proper styling
   */
  const formatExplanation = (text) => {
    if (!text) return null;
    
    // Split by code blocks first
    const parts = text.split(/```([\s\S]*?)```/);
    
    return (
      <>
        {parts.map((part, index) => {
          // Every even index is regular text, odd indexes are code blocks
          if (index % 2 === 0) {
            // Regular text - split by newlines
            return part.split('\n').map((line, lineIndex) => (
              <Paragraph 
                key={`${index}-${lineIndex}`} 
                style={{ 
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: line.match(/^[A-Z\d]+:/) ? 'bold' : 'normal'
                }}
              >
                {line}
              </Paragraph>
            ));
          } else {
            // Code block
            const codeLines = part.split('\n');
            const language = codeLines[0] || '';
            const code = language.match(/^\w+$/) 
              ? codeLines.slice(1).join('\n') 
              : part;
              
            return (
              <pre 
                key={`code-${index}`}
                style={{
                  padding: '8px',
                  marginBottom: '12px',
                  borderRadius: '4px',
                  backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(240, 240, 240, 0.7)',
                  overflowX: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`
                }}
              >
                <code>{code}</code>
              </pre>
            );
          }
        })}
      </>
    );
  };
  
  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <BookOutlined />
            <span>Code Explanation</span>
          </Space>
          <Space>
            <Tooltip title={simplified ? "Switch to regular explanations" : "Switch to simpler explanations for younger kids"}>
              <Switch
                checkedChildren={<SmileOutlined />}
                unCheckedChildren={<BulbOutlined />}
                checked={simplified}
                onChange={toggleSimplified}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Refresh explanation">
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={getExplanation}
                size="small"
                loading={isLoading}
              />
            </Tooltip>
            <Tooltip title={isPanelExpanded ? "Collapse panel" : "Expand panel"}>
              <Button
                type="text"
                icon={isPanelExpanded ? <UpOutlined /> : <DownOutlined />}
                onClick={togglePanelExpansion}
                size="small"
              />
            </Tooltip>
          </Space>
        </div>
      }
      bordered={false}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: isDarkMode ? '#141414' : '#fff'
      }}
      bodyStyle={{
        padding: '10px',
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
      headStyle={{
        padding: '0 10px',
        fontSize: '14px'
      }}
    >
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin tip="Generating explanation..." />
        </div>
      ) : explanation ? (
        <div style={{ overflow: 'auto' }}>
          <div>
            {formatExplanation(explanation.overall)}
          </div>
          
          {explanation.stepByStep && (
            <div style={{ marginTop: '12px' }}>
              <Collapse
                defaultActiveKey={showStepByStep ? ['1'] : []}
                ghost
                onChange={() => setShowStepByStep(!showStepByStep)}
              >
                <Panel 
                  header={<Text strong style={{ fontSize: '13px' }}>Step-by-Step Breakdown</Text>} 
                  key="1"
                  style={{
                    background: isDarkMode ? 'rgba(30, 30, 30, 0.3)' : 'rgba(240, 240, 240, 0.3)',
                    borderRadius: '4px',
                    border: `1px solid ${isDarkMode ? '#333' : '#eee'}`
                  }}
                >
                  {formatExplanation(explanation.stepByStep)}
                </Panel>
              </Collapse>
            </div>
          )}
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          color: isDarkMode ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'
        }}>
          <BookOutlined style={{ fontSize: '28px', marginBottom: '8px' }} />
          <Paragraph style={{ fontSize: '13px', margin: '0' }}>Run your code to see an explanation here!</Paragraph>
        </div>
      )}
    </Card>
  );
};

export default CodeExplanationPanel; 