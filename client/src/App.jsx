import React, { useState, useEffect, useRef } from 'react';
import { 
  Layout, 
  Button, 
  ConfigProvider, 
  theme as antTheme, 
  message, 
  Modal, 
  Typography, 
  Tour, 
  notification,
  Popover,
  Tooltip,
  Switch,
  Space,
  Divider
} from 'antd';
import {
  PlayCircleOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  ShareAltOutlined,
  BulbOutlined,
  RobotOutlined,
  CloseOutlined,
  SunOutlined,
  MoonOutlined,
  InfoCircleOutlined,
  CodeOutlined,
  ClearOutlined,
  DownloadOutlined,
  ApiOutlined
} from '@ant-design/icons';
import CodeEditor from './components/CodeEditor';
import Sidebar from './components/Sidebar';
import AIAssistant from './components/AIAssistant';
import DebuggingPanel from './components/DebuggingPanel';
import CodeExplanationPanel from './components/CodeExplanationPanel';
import OutputPanel from './components/OutputPanel';
import LanguageSelector from './components/LanguageSelector';
import ConnectionTest from './components/ConnectionTest';

const { Header, Content, Sider, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

// Create theme functions
const createDarkTheme = () => ({
  algorithm: antTheme.darkAlgorithm,
  token: {
    colorPrimary: '#3f51b5',
    colorInfo: '#3f51b5'
  },
});

const createLightTheme = () => ({
  algorithm: antTheme.defaultAlgorithm,
  token: {
    colorPrimary: '#3f51b5',
    colorInfo: '#3f51b5'
  },
});

// Coding facts for Quick Tips
const CODING_FACTS = [
  "Functions are like recipe instructions that tell the computer what to do!",
  "Variables are like containers that hold information for your program.",
  "Loops help you repeat actions without writing the same code over and over!",
  "Debugging is like being a code detective, finding and fixing mistakes.",
  "Conditionals (if statements) help your program make decisions.",
  "Comments help explain your code to other people (and future you!).",
  "Algorithms are step-by-step instructions to solve problems.",
  "Arrays are like lists that can store multiple values.",
  "Computers follow your instructions exactly, so be precise!",
  "Taking breaks while coding helps you solve problems better!"
];

// Default code templates for each language
const DEFAULT_CODE_TEMPLATES = {
  'c': `// Online C compiler to run C program online
#include <stdio.h>


int main() {
    // Write C code here
    printf("Hello young coders");
    
    return 0;
}`,
  'cpp': `// Online C++ compiler to run C++ program online
#include <iostream>

int main() {
    // Write C++ code here
    std::cout << "Hello young coders";
    
    return 0;
}`,
  'javascript': `// JavaScript code
console.log("Hello young coders");`,
  'typescript': `// TypeScript code
const message: string = "Hello young coders";
console.log(message);`,
  'python': `# Python code
print("Hello young coders")`,
  'php': `<?php
// PHP code
echo "Hello young coders";
?>`
};

/**
 * Main App Component
 * 
 * Orchestrates the entire application and maintains application state.
 */
function App() {
  // Core state
  const [code, setCode] = useState(DEFAULT_CODE_TEMPLATES['c']);
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('c');
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('main.c');
  const [error, setError] = useState('');
  
  // Theme state
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? createDarkTheme() : createLightTheme();
  
  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const appContainerRef = useRef(null);
  
  // Editor reference
  const editorRef = useRef(null);
  
  // Share state
  const [shareSnackbar, setShareSnackbar] = useState(false);
  
  // AI Assistant state
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  // Welcome tour state
  const [showWelcomeTour, setShowWelcomeTour] = useState(true);
  const [welcomeTourStep, setWelcomeTourStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  
  // Quick tip state
  const [quickTipOpen, setQuickTipOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  
  // Connection test state
  const [showConnectionTest, setShowConnectionTest] = useState(false);
  
  // References for tour
  const runButtonRef = useRef(null);
  const editorAreaRef = useRef(null);
  const aiButtonRef = useRef(null);
  const debuggingPanelRef = useRef(null);
  const outputPanelRef = useRef(null);
  const sidebarRef = useRef(null);
  const downloadButtonRef = useRef(null);
  
  // Show a random coding tip
  const showRandomTip = () => {
    setCurrentTip(Math.floor(Math.random() * CODING_FACTS.length));
    setQuickTipOpen(true);
    
    // Auto-close after 8 seconds
    setTimeout(() => {
      setQuickTipOpen(false);
    }, 8000);
  };
  
  // Show a tip periodically
  useEffect(() => {
    const tipInterval = setInterval(showRandomTip, 5 * 60 * 1000); // Show every 5 minutes
    
    // Show first tip after 2 minutes
    const firstTipTimeout = setTimeout(showRandomTip, 2 * 60 * 1000);
    
    return () => {
      clearInterval(tipInterval);
      clearTimeout(firstTipTimeout);
    };
  }, []);

  // Handle code changes
  const handleCodeChange = (value) => {
    setCode(value);
  };

  // Reset code to default template for current language
  const resetCode = () => {
    setCode(DEFAULT_CODE_TEMPLATES[language] || '// Write your code here');
    setOutput('');
    setError('');
    message.success('Created new file!');
  };

  // Handle language changes
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    
    // Update file extension based on language
    const extensions = {
      'c': '.c',
      'cpp': '.cpp',
      'javascript': '.js',
      'typescript': '.ts',
      'python': '.py',
      'php': '.php'
    };
    
    const extension = extensions[lang] || '.txt';
    const baseName = 'main';
    setFileName(`${baseName}${extension}`);
    
    // Set default code for each language
    setCode(DEFAULT_CODE_TEMPLATES[lang] || '// Write your code here');
  };

  // Execute code
  const runCode = async () => {
    setIsLoading(true);
    setOutput('Running...');
    setError('');
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });
      
      const data = await response.json();
      
      // Check for errors and set error state
      if (data.error) {
        setError(data.error);
      }
      
      setOutput(data.output || data.error || 'No output');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearOutput = () => {
    setOutput('');
    setError('');
  };
  
  // Toggle theme between light and dark
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (appContainerRef.current.requestFullscreen) {
        appContainerRef.current.requestFullscreen();
      } else if (appContainerRef.current.mozRequestFullScreen) {
        appContainerRef.current.mozRequestFullScreen();
      } else if (appContainerRef.current.webkitRequestFullscreen) {
        appContainerRef.current.webkitRequestFullscreen();
      } else if (appContainerRef.current.msRequestFullscreen) {
        appContainerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };
  
  const handleFullscreenChange = () => {
    setIsFullscreen(
      document.fullscreenElement || 
      document.mozFullScreenElement || 
      document.webkitFullscreenElement || 
      document.msFullscreenElement
    );
  };
  
  // Toggle AI Assistant
  const toggleAIAssistant = () => {
    setShowAIAssistant(!showAIAssistant);
  };
  
  // Listen for fullscreen changes
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Share code functionality 
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(code);
      message.success('Code copied to clipboard!');
    } catch (err) {
      message.error('Failed to copy code');
      console.error('Share error:', err);
    }
  };
  
  // Download code functionality
  const handleDownload = () => {
    try {
      const blob = new Blob([code], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
      message.success(`Code saved as ${fileName}`);
    } catch (err) {
      message.error('Failed to download code');
      console.error('Download error:', err);
    }
  };
  
  // Toggle connection test dialog
  const toggleConnectionTest = () => {
    setShowConnectionTest(!showConnectionTest);
  };
  
  // Tour steps configuration
  const tourSteps = [
    {
      title: 'Welcome to the Code Editor!',
      description: (
        <>
          <div className="flex items-center justify-center mb-4">
            <RobotOutlined style={{ fontSize: '48px', color: '#3f51b5' }} />
          </div>
          <Paragraph>
            This is your friendly coding environment where you can write, run, and learn programming!
          </Paragraph>
        </>
      ),
      target: () => document.body,
    },
    {
      title: 'Language Selection',
      description: (
        <Paragraph>
          Choose which programming language you want to use from this sidebar.
          Each language has different features and uses!
        </Paragraph>
      ),
      target: () => sidebarRef.current,
    },
    {
      title: 'The Code Editor',
      description: (
        <Paragraph>
          This is where you write your code. It helps you with auto-completion
          and highlights your code to make it easier to read!
        </Paragraph>
      ),
      target: () => editorAreaRef.current,
    },
    {
      title: 'Code Explanation',
      description: (
        <Paragraph>
          On the right side, you'll see explanations of your code to help you understand
          how it works. Great for learning programming concepts!
        </Paragraph>
      ),
      target: () => document.querySelector('.ant-card-head'),
    },
    {
      title: 'See Your Output',
      description: (
        <Paragraph>
          After running your code, you'll see the results here at the bottom.
          This shows what your program prints or any errors it encounters.
        </Paragraph>
      ),
      target: () => outputPanelRef.current,
    },
    {
      title: 'Run Your Code',
      description: (
        <Paragraph>
          Click this button to run your code and see the output at the bottom.
          Try it out!
        </Paragraph>
      ),
      target: () => runButtonRef.current,
    },
    {
      title: 'Download Your Code',
      description: (
        <Paragraph>
          When you're happy with your code, click this button to save it to your computer.
        </Paragraph>
      ),
      target: () => downloadButtonRef.current,
    },
    {
      title: 'AI Coding Helper',
      description: (
        <Paragraph>
          Need help? Click this button to talk to our AI assistant.
          It can help explain errors and teach you coding concepts!
        </Paragraph>
      ),
      target: () => aiButtonRef.current,
    },
    {
      title: "You're Ready to Go!",
      description: (
        <>
          <div className="flex items-center justify-center mb-4">
            <RobotOutlined style={{ fontSize: '48px', color: '#3f51b5' }} />
          </div>
          <Paragraph>
            You're all set to start coding! Remember, practice makes perfect.
            Happy coding!
          </Paragraph>
        </>
      ),
      target: () => document.body,
    },
  ];

  // Welcome modal content
  const welcomeModal = (
    <Modal
      title={<Title level={3} style={{ textAlign: 'center' }}>Welcome to Code Editor!</Title>}
      open={showWelcomeTour}
      onCancel={() => setShowWelcomeTour(false)}
      footer={[
        <Button key="skip" onClick={() => setShowWelcomeTour(false)}>
          Skip Tour
        </Button>,
        <Button 
          key="next" 
          type="primary"
          onClick={() => {
            setShowWelcomeTour(false);
            setTourOpen(true);
          }}
        >
          Start Tour
        </Button>,
      ]}
      width={600}
      centered
    >
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <RobotOutlined style={{ fontSize: '80px', color: '#3f51b5' }} />
      </div>
      <Paragraph style={{ fontSize: '16px', textAlign: 'center' }}>
        Welcome to your coding adventure! This interactive environment helps you learn 
        programming with a friendly AI assistant, code explanations, and debugging help.
      </Paragraph>
      <Paragraph style={{ fontSize: '16px', textAlign: 'center' }}>
        Would you like a quick tour to get started?
      </Paragraph>
    </Modal>
  );

  return (
    <ConfigProvider theme={theme}>
      <Layout className="app-container" ref={appContainerRef} style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CodeOutlined style={{ fontSize: '24px', marginRight: '8px', color: '#3f51b5' }} />
            <Title level={4} style={{ margin: 0, color: darkMode ? '#fff' : '#000' }}>
              Code Mentor
            </Title>
          </div>
          
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <Tooltip title="Test API Connection">
              <Button 
                type="text" 
                icon={<ApiOutlined />} 
                onClick={toggleConnectionTest}
              />
            </Tooltip>
            
            <LanguageSelector 
              language={language} 
              onLanguageChange={handleLanguageChange} 
            />
            
            <Tooltip title="Toggle theme">
              <Switch
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                checked={darkMode}
                onChange={toggleTheme}
              />
            </Tooltip>
            
            <Tooltip title="Run code">
              <Button 
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={runCode}
                loading={isLoading}
                ref={runButtonRef}
                className={!tourOpen ? "glow-button" : ""}
              >
                Run
              </Button>
            </Tooltip>
            
            <Tooltip title="Share code">
              <Button 
                icon={<ShareAltOutlined />} 
                onClick={handleShare}
              >
                Share
              </Button>
            </Tooltip>
            
            <Tooltip title="Fullscreen">
              <Button
                icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={toggleFullscreen}
              >
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </Button>
            </Tooltip>
            
            <Tooltip title="Get AI help">
              <Button
                icon={<RobotOutlined />}
                onClick={toggleAIAssistant}
                ref={aiButtonRef}
                type="default"
                className={!tourOpen && !showAIAssistant ? "pulse-button" : ""}
              >
                AI Help
              </Button>
            </Tooltip>
            
            <Tooltip title="Download code">
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                ref={downloadButtonRef}
              >
                Download
              </Button>
            </Tooltip>
          </div>
        </Header>
        
        <Layout>
          {/* Left Sidebar */}
          <div ref={sidebarRef}>
            <Sidebar 
              language={language} 
              onLanguageChange={handleLanguageChange}
              isDarkMode={darkMode}
              onNewFile={resetCode}
            />
          </div>
          
          {/* Main editor area */}
          <Content style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
            {/* Top section with editor and code explanation panel side by side */}
            <div style={{ display: 'flex', flex: 1 }}>
              {/* Code Editor */}
              <div
                ref={editorAreaRef}
                style={{
                  flex: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CodeEditor
                  code={code}
                  language={language}
                  onChange={handleCodeChange}
                  onEditorMount={(editor) => { editorRef.current = editor; }}
                  isDarkMode={darkMode}
                />
              </div>
              
              {/* Code explanation panel - moved to right side */}
              <div style={{ 
                width: '930px', 
                height: '600px',
                borderLeft: '1px solid #d9d9d9',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CodeExplanationPanel
                  code={code}
                  language={language}
                  output={output}
                  isDarkMode={darkMode}
                />
              </div>
            </div>
            
            {/* Horizontal layout for output and debugging panels */}
            <div style={{ display: 'flex', height: '280px', borderTop: '1px solid #d9d9d9' }}>
              {/* Output Panel - moved to bottom left */}
              <div 
                style={{ flex: 1, borderRight: '1px solid #d9d9d9' }}
                ref={outputPanelRef}
              >
                <OutputPanel 
                  output={output} 
                  onClear={clearOutput}
                  isDarkMode={darkMode}
                />
              </div>
              
              {/* Debugging panel */}
              <div style={{ flex: 1 }} ref={debuggingPanelRef}>
                <DebuggingPanel
                  code={code}
                  language={language}
                  editorRef={editorRef}
                  isDarkMode={darkMode}
                />
              </div>
            </div>
          </Content>
        </Layout>
        
        {/* AI Assistant */}
        {showAIAssistant && (
          <AIAssistant
            code={code}
            language={language}
            error={error}
            onClose={toggleAIAssistant}
          />
        )}
        
        {/* Welcome modal */}
        {welcomeModal}
        
        {/* Interactive Tour */}
        <Tour
          open={tourOpen}
          onClose={() => setTourOpen(false)}
          steps={tourSteps}
        />
        
        {/* Quick Tip Popup */}
        <Popover
          open={quickTipOpen}
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><BulbOutlined style={{ color: '#f39c12' }} /> Quick Tip</div>
              <Button 
                type="text" 
                icon={<CloseOutlined />} 
                size="small" 
                onClick={() => setQuickTipOpen(false)}
              />
            </div>
          }
          content={
            <div style={{ maxWidth: '300px' }}>
              <Paragraph style={{ margin: 0 }}>
                {CODING_FACTS[currentTip]}
              </Paragraph>
            </div>
          }
          placement="bottomRight"
          trigger="click"
        >
          <Button
            type="primary"
            shape="circle"
            icon={<BulbOutlined />}
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '20px',
              boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16)',
              display: quickTipOpen ? 'none' : 'block'
            }}
            onClick={() => setQuickTipOpen(true)}
          />
        </Popover>
        
        {/* Connection Test Modal */}
        <Modal
          title="API Connection Test"
          open={showConnectionTest}
          onCancel={toggleConnectionTest}
          footer={null}
          width={600}
        >
          <ConnectionTest />
        </Modal>
      </Layout>
    </ConfigProvider>
  );
}

export default App; 