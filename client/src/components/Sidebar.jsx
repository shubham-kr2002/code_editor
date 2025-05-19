import React from 'react';
import { Layout, Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Sider } = Layout;

/**
 * Sidebar Component
 * 
 * Vertical sidebar for programming language selection
 */
const Sidebar = ({ language, onLanguageChange, isDarkMode, onNewFile }) => {
  // Define supported languages
  const languages = [
    { id: 'c', name: 'C', display: 'C' },
    { id: 'cpp', name: 'C++', display: 'C++' },
    { id: 'javascript', name: 'JavaScript', display: 'JS' },
    { id: 'typescript', name: 'TypeScript', display: 'TS' },
    { id: 'python', name: 'Python', display: 'PY' },
    { id: 'php', name: 'PHP', display: 'php' },
  ];

  return (
    <Sider
      width={50}
      style={{
        background: isDarkMode ? '#141414' : '#fff',
        borderRight: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
        height: '100%',
        overflow: 'auto'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0' }}>
        <Tooltip title="New File" placement="right">
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={onNewFile}
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px'
            }}
          />
        </Tooltip>
        
        {languages.map((lang) => (
          <Tooltip key={lang.id} title={lang.name} placement="right">
            <Button
              type={language === lang.id ? "primary" : "text"}
              style={{
                width: '36px',
                height: '36px',
                margin: '4px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: language === lang.id ? 'bold' : 'normal',
                borderLeft: language === lang.id ? '3px solid #1677ff' : '3px solid transparent',
              }}
              onClick={() => onLanguageChange(lang.id)}
            >
              {lang.display}
            </Button>
          </Tooltip>
        ))}
      </div>
    </Sider>
  );
};

export default Sidebar; 