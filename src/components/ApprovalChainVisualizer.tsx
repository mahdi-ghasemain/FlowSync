import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  useTheme,
  Chip,
  Tooltip,
  Stack,
  keyframes,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ApprovalStep } from '../types';

interface ApprovalChainVisualizerProps {
  steps: ApprovalStep[];
  currentStep: number;
}

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.35); }
  70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
`;

const statusConfig: Record<
  string,
  { icon: React.ReactNode; bg: string; fg: string; ring?: boolean }
> = {
  approved: { icon: <CheckIcon fontSize="small" />, bg: '#dcfce7', fg: '#15803d' },
  rejected: { icon: <CloseIcon fontSize="small" />, bg: '#fee2e2', fg: '#b91c1c' },
  current: { icon: <MoreHorizIcon fontSize="small" />, bg: '#dbeafe', fg: '#1e40af', ring: true },
  pending: { icon: <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#9ca3af' }} />, bg: '#f3f4f6', fg: '#6b7280' },
};

const ApprovalChainVisualizer: React.FC<ApprovalChainVisualizerProps> = ({ steps, currentStep }) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
        زنجیره تأیید
      </Typography>

      <Stack>
        {steps.map((step, index) => {
          const isApproved = step.status === 'approved';
          const isRejected = step.status === 'rejected';
          const isCurrent = index === currentStep && !isApproved && !isRejected;
          const statusKey = isRejected ? 'rejected' : isApproved ? 'approved' : isCurrent ? 'current' : 'pending';
          const cfg = statusConfig[statusKey];

          return (
            <React.Fragment key={step.id}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {/* Node icon */}
                <Tooltip title={isRejected ? 'رد شده' : isApproved ? 'تأیید شده' : isCurrent ? 'مرحله جاری' : 'در انتظار'}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: cfg.bg,
                      color: cfg.fg,
                      fontSize: 16,
                      animation: cfg.ring ? `${pulse} 2s ease-in-out infinite` : 'none',
                    }}
                  >
                    {cfg.icon}
                  </Avatar>
                </Tooltip>

                {/* Card */}
                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: isRejected ? '#fecaca' : isApproved ? '#bbf7d0' : isCurrent ? 'primary.main' : 'divider',
                    bgcolor:
                      isRejected ? '#fef2f2' : isApproved ? '#f0fdf4' : isCurrent ? 'primary.light' + '0d' : 'background.paper',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {step.approverName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {step.approverRole}
                    </Typography>
                  </Box>
                  {isApproved && step.timestamp ? (
                    <Chip
                      label={new Date(step.timestamp).toLocaleDateString('fa-IR')}
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ height: 20, fontSize: 10 }}
                    />
                  ) : isCurrent ? (
                    <Chip label="جاری" size="small" color="primary" sx={{ height: 20, fontSize: 10, fontWeight: 700 }} />
                  ) : null}
                </Paper>
              </Box>

              {/* Connector */}
              {index < steps.length - 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.25 }}>
                  <Box
                    sx={{
                      width: 2,
                      height: 18,
                      borderRadius: 1,
                      bgcolor: isApproved ? '#16a34a' : 'divider',
                      transition: 'background-color 0.3s ease',
                    }}
                  />
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ApprovalChainVisualizer;