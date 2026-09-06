import React from 'react';
import { Box, Typography, Paper, Avatar, Chip, Divider, useTheme } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CommentIcon from '@mui/icons-material/Comment';
import ForwardIcon from '@mui/icons-material/Forward';
import { AuditEvent } from '../types';

interface AuditTimelineProps {
  events: AuditEvent[];
}

const eventConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  created: { label: 'ایجاد درخواست', color: '#2563eb', bg: '#dbeafe', icon: <CreateIcon fontSize="small" /> },
  approved: { label: 'تأیید', color: '#16a34a', bg: '#dcfce7', icon: <CheckCircleIcon fontSize="small" /> },
  rejected: { label: 'رد', color: '#dc2626', bg: '#fee2e2', icon: <CancelIcon fontSize="small" /> },
  commented: { label: 'نظر', color: '#d97706', bg: '#fef3c7', icon: <CommentIcon fontSize="small" /> },
  forwarded: { label: 'ارجاع', color: '#7c3aed', bg: '#ede9fe', icon: <ForwardIcon fontSize="small" /> },
};

const AuditTimeline: React.FC<AuditTimelineProps> = ({ events }) => {
  const theme = useTheme();
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main' }} />
        تاریخچه رویدادها
      </Typography>

      <Box sx={{ position: 'relative' }}>
        {/* Vertical line */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            bottom: 12,
            width: 2,
            right: 15,
            bgcolor: 'divider',
            borderRadius: 1,
          }}
        />

        <Box>
          {sorted.map((event, idx) => {
            const cfg = eventConfig[event.type] || eventConfig.commented;
            const initials = event.actorName.split(' ').map((w) => w[0]).slice(0, 2).join('');
            return (
              <Box key={event.id} sx={{ display: 'flex', gap: 2.5, mb: 2.5, position: 'relative' }}>
                {/* Avatar node */}
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: cfg.bg,
                    color: cfg.color,
                    fontSize: 15,
                    zIndex: 1,
                    border: '2px solid',
                    borderColor: theme.palette.background.paper,
                  }}
                >
                  {cfg.icon}
                </Avatar>

                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 1.8,
                    borderRadius: 2.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    transition: 'transform 0.15s ease',
                    '&:hover': { transform: 'translateY(-1px)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 26, height: 26, bgcolor: cfg.color, fontSize: 10, fontWeight: 700 }}>
                        {initials}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {event.actorName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={cfg.label}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: 10,
                          fontWeight: 700,
                          bgcolor: cfg.bg,
                          color: cfg.color,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(event.timestamp).toLocaleDateString('fa-IR')} ·{' '}
                        {new Date(event.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, pr: 5.5 }}>
                    {event.details}
                  </Typography>
                </Paper>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default AuditTimeline;