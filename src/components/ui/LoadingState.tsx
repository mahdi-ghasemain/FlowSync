import React from 'react';
import { Box, Skeleton } from '@mui/material';

interface LoadingStateProps {
  rows?: number;
  height?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ rows = 4, height = 56 }) => {
  return (
    <Box sx={{ p: 2 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rounded"
          height={height}
          sx={{ mb: 1.5, borderRadius: 2 }}
          animation="wave"
        />
      ))}
    </Box>
  );
};

export default LoadingState;