import React from 'react';
import { Box, Typography } from '@mui/material';

export type Status = 'pending' | 'approved' | 'rejected' | 'final_approved';

interface RequestStatusBadgeProps {
  status: Status;
  size?: 'small' | 'medium';
}

const config: Record<Status, { label: string; bg: string; fg: string }> = {
  pending: { label: 'در انتظار', bg: '#fef3c7', fg: '#b45309' },
  approved: { label: 'تأیید شده', bg: '#dcfce7', fg: '#15803d' },
  rejected: { label: 'رد شده', bg: '#fee2e2', fg: '#b91c1c' },
  final_approved: { label: 'تأیید نهایی', bg: '#dbeafe', fg: '#1d4ed8' },
};

const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({ status, size = 'medium' }) => {
  const c = config[status];
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        bgcolor: c.bg,
        color: c.fg,
        borderRadius: 999,
        px: size === 'small' ? 1.2 : 1.6,
        py: size === 'small' ? 0.35 : 0.5,
        fontSize: size === 'small' ? 11 : 12.5,
        fontWeight: 700,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
    >
      {c.label}
    </Box>
  );
};

export default RequestStatusBadge;