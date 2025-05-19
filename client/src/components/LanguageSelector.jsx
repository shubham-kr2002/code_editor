import React from 'react';
import { Select } from 'antd';
import { CodeOutlined } from '@ant-design/icons';

const { Option } = Select;

/**
 * LanguageSelector Component
 * 
 * Allows users to select the programming language for the code editor.
 * Uses Ant Design components.
 */
const languages = [
  { id: 'c', name: 'C' },
  { id: 'cpp', name: 'C++' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'php', name: 'PHP' },
];

const LanguageSelector = ({ language, onLanguageChange }) => {
  return (
    <Select
      value={language}
      onChange={onLanguageChange}
      style={{ width: 140 }}
      suffixIcon={<CodeOutlined />}
    >
      {languages.map((lang) => (
        <Option key={lang.id} value={lang.id}>
          {lang.name}
        </Option>
      ))}
    </Select>
  );
};

export default LanguageSelector; 