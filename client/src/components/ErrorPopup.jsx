import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * ErrorPopup Component
 * 
 * Displays a kid-friendly error explanation with fix suggestions
 * and an option to apply the fix automatically.
 */
const ErrorPopup = ({ 
  error, 
  onClose, 
  onApplyFix, 
  isDarkMode,
  hasFix = false
}) => {
  if (!error) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        maxWidth: '400px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        bgcolor: isDarkMode ? 'rgba(50, 50, 50, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        border: '1px solid',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          backgroundColor: isDarkMode ? 'error.dark' : 'error.light',
          color: 'white',
        }}
      >
        <ErrorOutlineIcon sx={{ mr: 1 }} />
        <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Oops! Something's Not Right
        </Typography>
        <IconButton 
          size="small" 
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 500 }}>
          {error.explanation}
        </Typography>
        
        <Box 
          sx={{ 
            p: 1.5, 
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
            borderRadius: '8px',
            mb: 2,
            borderLeft: '4px solid',
            borderColor: 'primary.main'
          }}
        >
          <Typography variant="body2">
            <strong>Suggestion:</strong> {error.suggestion}
          </Typography>
        </Box>
        
        {hasFix && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AutoFixHighIcon />}
            onClick={onApplyFix}
            fullWidth
            sx={{ mb: 1 }}
          >
            Fix It For Me
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ErrorPopup; 