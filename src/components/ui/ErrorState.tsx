import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message = 'خطایی رخ داد. لطفاً دوباره تلاش کنید.', onRetry }) => {
  return (
    <Box
      sx={{
        py: 10,
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 56, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        مشکلی پیش آمد
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" color="primary" onClick={onRetry} sx={{ mt: 3 }}>
          تلاش مجدد
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;