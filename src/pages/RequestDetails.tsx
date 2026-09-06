import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Stack,
  Divider,
  Avatar,
  Button,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Skeleton,
  useTheme,
  Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useRequestStore } from '../store/requestStore';
import { useAuthStore } from '../store/authStore';
import { mockRequestDetail, typeLabels } from '../utils/mockData';
import ApprovalChainVisualizer from '../components/ApprovalChainVisualizer';
import AuditTimeline from '../components/AuditTimeline';
import SignaturePad from '../components/SignaturePad';
import RequestStatusBadge from '../components/ui/RequestStatusBadge';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const stepLabel = (status: string) =>
  status === 'final_approved'
    ? 'این درخواست تأیید نهایی شده است'
    : status === 'rejected'
    ? 'این درخواست رد شده است'
    : 'در حال بررسی توسط تأییدکنندگان';

// Persian labels for dynamic form keys
const fieldLabels: Record<string, string> = {
  startDate: 'تاریخ شروع',
  endDate: 'تاریخ پایان',
  reason: 'دلیل',
  leaveType: 'نوع مرخصی',
  amount: 'مبلغ (ریال)',
  item: 'کالا',
  quantity: 'تعداد',
  vendor: 'فروشنده',
  destination: 'مقصد',
  duration: 'مدت سفر',
  purpose: 'هدف سفر',
  description: 'شرح',
};

const RequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentRequest, setCurrentRequest } = useRequestStore();
  const [signOpen, setSignOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [approved, setApproved] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    // Business logic preserved: would call requestAPI.getById(id)
    setCurrentRequest(mockRequestDetail);
    return () => setCurrentRequest(null);
  }, [id, setCurrentRequest]);

  const canApprove = user?.role === 'supervisor' || user?.role === 'admin';
  const isPending = currentRequest?.status === 'pending';
  const chain = currentRequest?.approvalChain || [];
  const doneSteps = chain.filter((s) => s.status === 'approved').length;
  const progress = chain.length ? Math.round((doneSteps / chain.length) * 100) : 0;

  const handleApprove = (signature: string) => {
    // Business logic preserved: would call approvalAPI.approve(id, { signature })
    setSignOpen(false);
    setApproved(true);
    toast.success('درخواست با موفقیت تأیید شد ✅');
  };

  const handleReject = () => {
    if (rejectComment.trim()) {
      setRejectOpen(false);
      setRejectComment('');
      toast.error('درخواست رد شد ❌');
    }
  };

  if (!currentRequest) {
    return (
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        <Skeleton variant="text" width="30%" height={44} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="50%" height={20} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            <Skeleton variant="rounded" height={260} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} lg={5}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  const f = currentRequest.formData;

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Tooltip title="بازگشت">
          <Button size="small" onClick={() => navigate(-1)} sx={{ minWidth: 40, p: 1 }}>
            <ArrowBackIcon />
          </Button>
        </Tooltip>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
            {currentRequest.title}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 0.7 }} flexWrap="wrap">
            <Chip label={typeLabels[currentRequest.type]} size="small" variant="outlined" />
            <RequestStatusBadge status={currentRequest.status as any} size="small" />
            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
              کد: {currentRequest.code || currentRequest.id}
            </Typography>
          </Stack>
        </Box>
      </Box>

      {/* Final approval banner */}
      {(approved || currentRequest.status === 'final_approved') && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: 2.5,
            '& .MuiAlert-message': { fontWeight: 600 },
          }}
          icon={<CheckCircleIcon />}
        >
          🎉 تأیید نهایی! این درخواست توسط تمام تأییدکنندگان تأیید شده و وضعیت آن «تأیید نهایی» است.
        </Alert>
      )}

      {currentRequest.status === 'rejected' && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5, '& .MuiAlert-message': { fontWeight: 600 } }}>
          این درخواست رد شده است. برای جزئیات، تاریخچه رویدادها را بررسی کنید.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* LEFT: info */}
        <Grid item xs={12} lg={7}>
          <Stack spacing={3}>
            {/* Request info card */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
                اطلاعات درخواست
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 2, mb: 3 }}>
                {currentRequest.description}
              </Typography>

              {/* Section title for type-specific fields */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary' }}>
                جزئیات {typeLabels[currentRequest.type]}
              </Typography>
              <Grid container spacing={1.5} sx={{ mb: 3 }}>
                {Object.entries(f).map(([key, value]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Box
                      sx={{
                        px: 2,
                        py: 1.4,
                        borderRadius: 2,
                        bgcolor: 'action.hover',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" display="block">
                        {fieldLabels[key] || key}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {typeof value === 'number' ? Number(value).toLocaleString('fa-IR') : String(value)}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ mb: 2.5 }} />

              {/* Applicant info */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary' }}>
                اطلاعات متقاضی
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontSize: 17 }}>
                  {currentRequest.creatorName.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {currentRequest.creatorName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(currentRequest.createdAt).toLocaleDateString('fa-IR')}
                  </Typography>
                </Box>
              </Box>

              {/* Attachments */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary' }}>
                پیوست‌ها
              </Typography>
              {currentRequest.attachments?.length ? (
                <Stack spacing={1}>
                  {currentRequest.attachments.map((a, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachFileIcon fontSize="small" color="primary" />
                      <Typography variant="body2">{a}</Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  پیوستی برای این درخواست ثبت نشده است.
                </Typography>
              )}
            </Paper>

            {/* Timeline */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <AuditTimeline events={currentRequest.auditLog} />
            </Paper>
          </Stack>
        </Grid>

        {/* RIGHT: chain + actions */}
        <Grid item xs={12} lg={5}>
          <Stack spacing={3} sx={{ position: 'sticky', top: 88 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <ApprovalChainVisualizer steps={chain} currentStep={currentRequest.currentStep} />

              {/* Progress */}
              <Box sx={{ mt: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.7 }}>
                  <Typography variant="caption" color="text.secondary">
                    پیشرفت تأیید
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {doneSteps} از {chain.length}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  color={progress === 100 ? 'success' : 'primary'}
                  sx={{ height: 7, borderRadius: 4 }}
                />
              </Box>

              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Avatar sx={{ width: 30, height: 30, bgcolor: 'warning.main', fontSize: 15 }}>⏳</Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    وضعیت جاری
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {stepLabel(currentRequest.status)}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Actions */}
            {canApprove && isPending && !approved && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'success.light',
                  bgcolor: theme.palette.mode === 'light' ? '#f0fdf4' : 'rgba(22,163,74,0.08)',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
                  اقدام مورد نیاز
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  شما تأییدکننده این مرحله هستید. با تأیید، امضای دیجیتال شما ثبت می‌شود.
                </Typography>
                <Stack spacing={1.5}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => setSignOpen(true)}
                    sx={{ fontWeight: 700 }}
                  >
                    تأیید با امضای دیجیتال
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => setRejectOpen(true)}
                  >
                    رد درخواست
                  </Button>
                </Stack>
              </Paper>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Signature dialog */}
      <SignaturePad
        open={signOpen}
        title={`تأیید: ${currentRequest.title}`}
        onSign={handleApprove}
        onCancel={() => setSignOpen(false)}
      />

      {/* Reject dialog */}
      <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>رد درخواست</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
            {currentRequest.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            {typeLabels[currentRequest.type]} · {currentRequest.creatorName}
          </Typography>
          <TextField
            fullWidth
            label="دلیل رد (الزامی)"
            multiline
            rows={3}
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
            placeholder="لطفاً دلیل رد درخواست را بنویسید..."
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setRejectOpen(false)} variant="outlined" color="inherit">
            انصراف
          </Button>
          <Button
            onClick={handleReject}
            color="error"
            variant="contained"
            disabled={!rejectComment.trim()}
          >
            رد درخواست
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestDetails;