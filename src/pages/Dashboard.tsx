import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Avatar,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import GroupsIcon from '@mui/icons-material/Groups';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SendIcon from '@mui/icons-material/Send';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HistoryIcon from '@mui/icons-material/History';
import { useAuthStore } from '../store/authStore';
import { mockRequests, activityFeed, timeAgo } from '../utils/mockData';
import StatCard from '../components/ui/StatCard';
import RequestStatusBadge from '../components/ui/RequestStatusBadge';
import RequestTypeBadge from '../components/ui/RequestTypeBadge';
import { RequestType } from '../types';

// ------------------------------------------------------------------ Donut
const DonutChart: React.FC<{ segments: { value: number; color: string }[]; center: string; label: string }> = ({
  segments,
  center,
  label,
}) => {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = 52;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <Box sx={{ position: 'relative', width: 150, height: 150 }}>
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={r} fill="none" stroke="#eef2f7" strokeWidth="16" />
        {total > 0 &&
          segments.map((s, i) => {
            const frac = s.value / total;
            const dash = frac * c;
            const el = (
              <circle
                key={i}
                cx="75"
                cy="75"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="16"
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-acc * c}
                strokeLinecap="butt"
                transform="rotate(-90 75 75)"
                style={{ transition: 'stroke-dasharray .6s ease' }}
              />
            );
            acc += frac;
            return el;
          })}
      </svg>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
          {center}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

// ------------------------------------------------------------------ Page
const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const theme = useTheme();

  const stats = useMemo(() => {
    const reqs = mockRequests;
    const pending = reqs.filter((r) => r.status === 'pending').length;
    const approved = reqs.filter((r) => r.status === 'approved').length;
    const rejected = reqs.filter((r) => r.status === 'rejected').length;
    const finalApproved = reqs.filter((r) => r.status === 'final_approved').length;
    return { pending, approved, rejected, finalApproved, total: reqs.length };
  }, []);

  const recent = mockRequests.slice(0, 5);

  const segments = useMemo(() => {
    const rows = [
      { value: stats.approved + stats.finalApproved, color: '#22c55e', label: 'تأیید شده' },
      { value: stats.pending, color: '#f59e0b', label: 'در انتظار' },
      { value: stats.rejected, color: '#ef4444', label: 'رد شده' },
    ];
    const total = rows.reduce((s, x) => s + x.value, 0);
    return rows.map((r) => ({ ...r, pct: total ? Math.round((r.value / total) * 100) : 0 }));
  }, [stats]);

  const isManager = user?.role === 'supervisor' || user?.role === 'admin';

  return (
    <Box>
      {/* Greeting banner */}
      <Card
        sx={{
          borderRadius: 4,
          mb: 3,
          background:
            theme.palette.mode === 'light'
              ? 'linear-gradient(120deg,#3b82f6 0%,#6366f1 55%,#a855f7 100%)'
              : 'linear-gradient(120deg,#1e3a8a 0%,#312e81 55%,#4c1d95 100%)',
          color: '#fff',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                صبح بخیر، {user?.name?.split(' ')[0]} 👋
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mb: 2.5 }}>
                اینجا وضعیت درخواست‌های امروز شماست — {stats.pending} درخواست منتظر اقدام شماست.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/requests/new')}
                sx={{ bgcolor: '#fff', color: 'primary.dark', fontWeight: 800, '&:hover': { bgcolor: '#f1f5f9' } }}
              >
                ثبت درخواست جدید
              </Button>
            </Box>

            {/* Floating date card */}
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,.14)',
                backdropFilter: 'blur(8px)',
                borderRadius: 3,
                px: 3,
                py: 2,
                border: '1px solid rgba(255,255,255,.2)',
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700, opacity: 0.9 }}>
                امروز
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {new Date().toLocaleDateString('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                «فرایندهای بهتر، تیم‌های شادتر»
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stat cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={6} lg={3}>
          <StatCard title="در انتظار" value={stats.pending} icon={<HourglassEmptyIcon />} color="warning" trend="۲ مورد جدید از دیروز" trendDirection="up" />
        </Grid>
        <Grid item xs={6} lg={3}>
          <StatCard title="تأیید شده" value={stats.approved + stats.finalApproved} icon={<CheckCircleIcon />} color="success" trend="۱۲٪ نسبت به دیروز" trendDirection="up" />
        </Grid>
        <Grid item xs={6} lg={3}>
          <StatCard title="رد شده" value={stats.rejected} icon={<CancelIcon />} color="error" trend="۱ مورد از دیروز" trendDirection="up" />
        </Grid>
        <Grid item xs={6} lg={3}>
          <StatCard title="تأییدهای در انتظار من" value={stats.pending} icon={<GroupsIcon />} color="primary" trend="برای اقدام" />
        </Grid>
      </Grid>

      {/* Main grid */}
      <Grid container spacing={2.5}>
        {/* Recent requests */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%' }}>
            <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                درخواست‌های اخیر
              </Typography>
              <Button size="small" endIcon={<ChevronLeftIcon />} onClick={() => navigate('/history')} sx={{ fontWeight: 700 }}>
                مشاهده همه
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>کد</TableCell>
                    <TableCell>نوع</TableCell>
                    <TableCell>متقاضی</TableCell>
                    <TableCell>تاریخ</TableCell>
                    <TableCell>وضعیت</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recent.map((req) => (
                    <TableRow
                      key={req.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/requests/${req.id}`)}
                    >
                      <TableCell sx={{ fontWeight: 700, fontSize: 12.5, color: 'primary.main' }}>
                        {req.code || req.id}
                      </TableCell>
                      <TableCell>
                        <RequestTypeBadge type={req.type as RequestType} withIcon={false} />
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{req.creatorName}</TableCell>
                      <TableCell sx={{ fontSize: 12.5, color: 'text.secondary' }}>
                        {new Date(req.createdAt).toLocaleDateString('fa-IR')}
                      </TableCell>
                      <TableCell>
                        <RequestStatusBadge status={req.status as any} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Right column: donut + quick actions */}
        <Grid item xs={12} md={6} lg={4}>
          <Stack spacing={2.5}>
            <Card>
              <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  وضعیت درخواست‌ها
                </Typography>
                <Button size="small" endIcon={<ChevronLeftIcon />} onClick={() => navigate('/history')} sx={{ fontWeight: 700 }}>
                  جزئیات
                </Button>
              </Box>
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                  <DonutChart segments={segments.map(({ value, color }) => ({ value, color }))} center={String(stats.total)} label="کل درخواست‌ها" />
                  <Box sx={{ minWidth: 150 }}>
                    {segments.map((s, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: s.color }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12.5 }}>
                            {s.label}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 12.5 }}>
                          {s.pct}٪
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                  دسترسی سریع
                </Typography>
                <Stack spacing={1}>
                  <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/requests/new')} sx={{ py: 1.1 }}>
                    درخواست جدید
                  </Button>
                  {isManager && (
                    <Button fullWidth variant="outlined" startIcon={<FactCheckIcon />} onClick={() => navigate('/approvals')} sx={{ py: 1.1 }}>
                      تأیید در انتظار
                    </Button>
                  )}
                  <Button fullWidth variant="outlined" color="inherit" startIcon={<HistoryIcon />} onClick={() => navigate('/history')} sx={{ py: 1.1 }}>
                    مشاهده تاریخچه
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Activity feed */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <Box sx={{ p: 2.5, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                فعالیت‌های اخیر
              </Typography>
              <Button size="small" onClick={() => navigate('/history')} sx={{ fontWeight: 700 }}>
                همه
              </Button>
            </Box>
            <CardContent sx={{ pt: 0.5 }}>
              <Stack spacing={1.5}>
                {activityFeed.map((a) => {
                  const iconBg =
                    a.type === 'approve'
                      ? { bg: '#f0fdf4', fg: '#16a34a', icon: '✓' }
                      : a.type === 'reject'
                      ? { bg: '#fef2f2', fg: '#dc2626', icon: '✕' }
                      : a.type === 'forward'
                      ? { bg: '#eff6ff', fg: '#2563eb', icon: '↪' }
                      : { bg: '#f5f3ff', fg: '#7c3aed', icon: '📄' };
                  return (
                    <Box key={a.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Avatar sx={{ width: 34, height: 34, bgcolor: iconBg.bg, color: iconBg.fg, fontSize: 15 }}>
                        {iconBg.icon}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 12.5, lineHeight: 1.5 }}>
                          {a.code} · {a.text}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {a.meta} · {timeAgo(a.time)}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;