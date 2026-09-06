import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

const colorMap = {
  primary: { bg: '#eff6ff', fg: '#2563eb' },
  success: { bg: '#f0fdf4', fg: '#16a34a' },
  warning: { bg: '#fffbeb', fg: '#d97706' },
  error: { bg: '#fef2f2', fg: '#dc2626' },
  info: { bg: '#f5f3ff', fg: '#7c3aed' },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'primary', trend, trendDirection = 'neutral' }) => {
  const c = colorMap[color];
  const trendColor = trendDirection === 'up' ? '#16a34a' : trendDirection === 'down' ? '#dc2626' : '#6b7a90';

  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'default',
        '&:hover': { boxShadow: '0 8px 24px rgba(16,24,40,.1)', transform: 'translateY(-2px)' },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: c.bg,
              color: c.fg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          {value}
        </Typography>
        {trend && (
          <Typography variant="caption" sx={{ color: trendColor, fontWeight: 600 }}>
            {trendDirection === 'up' ? '↗' : trendDirection === 'down' ? '↘' : ''} {trend}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;