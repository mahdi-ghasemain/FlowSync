import React from 'react';
import { Box, Typography } from '@mui/material';
import typeLabels from '../../utils/typeLabels';
import { RequestType } from '../../types';

interface RequestTypeBadgeProps {
  type: RequestType;
  withIcon?: boolean;
}

const icons: Record<string, string> = {
  purchase: '🛒',
  leave: '🏖️',
  expense: '💳',
  travel: '✈️',
};

const RequestTypeBadge: React.FC<RequestTypeBadgeProps> = ({ type, withIcon = true }) => {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8 }}>
      {withIcon && (
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: 1.5,
            bgcolor: '#eef2f7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
          }}
        >
          {icons[type] || '📄'}
        </Box>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
        {typeLabels[type]}
      </Typography>
    </Box>
  );
};

export default RequestTypeBadge;