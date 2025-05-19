import React from 'react';
import { Typography, Card, Button } from 'antd';
import { ClearOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

/**
 * OutputPanel Component
 * 
 * Displays the output of executed code using Ant Design components.
 * Now optimized for horizontal layout at the bottom.
 */
const OutputPanel = ({ output, onClear, isDarkMode }) => {
  // Detect if output contains an error message
  const isError = output && (output.toLowerCase().includes('error') || output.toLowerCase().includes('exception'));
  
  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong>Output</Text>
          {output && (
            <Button 
              type="text" 
              icon={<ClearOutlined />} 
              onClick={onClear} 
              size="small"
              title="Clear output"
            />
          )}
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
        padding: '12px',
        flex: 1,
        overflow: 'auto'
      }}
      headStyle={{
        padding: '8px 12px',
        borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`
      }}
    >
      {output ? (
        <pre
          style={{
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            whiteSpace: 'pre-wrap',
            margin: 0,
            color: isError ? '#ff4d4f' : (isDarkMode ? '#fff' : '#000'),
            height: '100%',
            width: '100%',
            overflow: 'auto'
          }}
        >
          {output}
        </pre>
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          color: isDarkMode ? '#999' : '#666',
          textAlign: 'center',
          padding: '0'
        }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Run your code to see output here
          </Text>
        </div>
      )}
    </Card>
  );
};

export default OutputPanel; 