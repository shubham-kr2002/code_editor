import React, { useState } from 'react';
import { Button, Card, Typography, Alert, Spin } from 'antd';
import { testGeminiConnection } from '../utils/testConnection';

const { Title, Text } = Typography;

/**
 * ConnectionTest Component
 * 
 * A simple component to test the connection to the Gemini API.
 */
const ConnectionTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const testResult = await testGeminiConnection();
      
      if (testResult.success) {
        setResult(testResult.data);
      } else {
        setError(testResult.message);
      }
    } catch (err) {
      setError(`Error testing connection: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Gemini API Connection Test" style={{ width: 500, margin: '20px auto' }}>
      <Button 
        type="primary" 
        onClick={handleTest} 
        loading={loading}
        style={{ marginBottom: 16 }}
      >
        Test Connection
      </Button>

      {loading && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <Spin tip="Testing connection..." />
        </div>
      )}

      {error && (
        <Alert
          message="Connection Error"
          description={error}
          type="error"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}

      {result && (
        <div style={{ marginTop: 16 }}>
          <Alert
            message="Connection Successful"
            description={`Successfully connected to Gemini API: ${result.message}`}
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Title level={5}>Response from Gemini:</Title>
          <Text>{result.response}</Text>
        </div>
      )}
    </Card>
  );
};

export default ConnectionTest; 