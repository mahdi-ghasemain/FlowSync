import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  Avatar,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Grid,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ApprovalRequest } from '../types';
import typeLabels from '../utils/typeLabels';
import RequestStatusBadge from './ui/RequestStatusBadge';
import SignaturePad from './SignaturePad';

interface ApprovalQueueProps {
  approvals: ApprovalRequest[];
  onApprove: (id: string, signature: string, comment?: string) => void;
  onReject: (id: string, comment: string) => void;
  onSelect: (id: string) => void;
}

const waitTime = (createdAt: string) => {
  const diff = Date.now() - new Date(createdAt).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'کمتر از ۱ ساعت';
  if (hours < 24) return `${hours} ساعت`;
  return `${Math.floor(hours / 24)} روز`;
};

const ApprovalQueue: React.FC<ApprovalQueueProps> = ({ approvals, onApprove, onReject, onSelect }) => {
  const theme = useTheme();
  const [signFor, setSignFor] = useState<ApprovalRequest | null>(null);
  const [rejectFor, setRejectFor] = useState<ApprovalRequest | null>(null);
  const [comment, setComment] = useState('');
  const [rejectComment, setRejectComment] = useState('');

  const sorted = [...approvals].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const handleSign = (signature: string) => {
    if (signFor) {
      onApprove(signFor.id, signature, comment || undefined);
    }
    setSignFor(null);
    setComment('');
  };

  const handleRejectConfirm = () => {
    if (rejectFor && rejectComment.trim()) {
      onReject(rejectFor.id, rejectComment);
      setRejectFor(null);
      setRejectComment('');
    }
  };

  return (
    <Box>
      {sorted.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            p: 8,
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ fontSize: 52, mb: 2 }}>🎉</Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            درخواست در انتظاری نیست
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            تمام درخواست‌ها بررسی شده‌اند. درخواست جدیدی برای تأیید دریافت نشده است.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {sorted.map((request) => (
            <Grid item xs={12} key={request.id}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  p: { xs: 2, md: 2.5 },
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.light',
                    boxShadow: '0 4px 16px rgba(37,99,235,0.08)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {/* Type icon */}
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 44,
                      height: 44,
                      bgcolor: 'primary.light' + '1f',
                      fontSize: 22,
                    }}
                  >
                    {request.type === 'purchase' ? '🛒' : request.type === 'leave' ? '🏖️' : request.type === 'expense' ? '💳' : '✈️'}
                  </Avatar>

                  {/* Info */}
                  <Box sx={{ flex: 1, minWidth: 240, cursor: 'pointer' }} onClick={() => onSelect(request.id)}>
                    <Stack direction="row" spacing={1} sx={{ mb: 0.7, flexWrap: 'wrap' }}>
                      <Chip label={typeLabels[request.type]} size="small" variant="outlined" sx={{ height: 22, fontSize: 11 }} />
                      <RequestStatusBadge status={request.status as any} size="small" />
                    </Stack>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {request.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 600, mt: 0.3 }}>
                      {request.description}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 1 }} flexWrap="wrap">
                      <Typography variant="caption" color="text.secondary">
                        از: <b>{request.creatorName}</b>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        تاریخ: {new Date(request.createdAt).toLocaleDateString('fa-IR')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        زمان انتظار: {waitTime(request.createdAt)}
                      </Typography>
                      {request.formData?.amount && (
                        <Typography variant="caption" color="text.secondary">
                          مبلغ: {Number(request.formData.amount).toLocaleString('fa-IR')} ریال
                        </Typography>
                      )}
                    </Stack>
                  </Box>

                  {/* Actions */}
                  <Stack direction={{ xs: 'row', md: 'column' }} spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => onSelect(request.id)}
                    >
                      مشاهده
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => { setSignFor(request); setComment(''); }}
                    >
                      تأیید
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => { setRejectFor(request); setRejectComment(''); }}
                    >
                      رد
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Signature dialog */}
      <SignaturePad
        open={Boolean(signFor)}
        title={signFor ? `تأیید: ${signFor.title}` : 'امضای دیجیتال'}
        onSign={handleSign}
        onCancel={() => { setSignFor(null); setComment(''); }}
      />

      {/* Reject dialog */}
      <Dialog
        open={Boolean(rejectFor)}
        onClose={() => setRejectFor(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>رد درخواست</DialogTitle>
        <DialogContent>
          {rejectFor && (
            <>
              <Paper
                elevation={0}
                sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', mb: 2 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{rejectFor.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {typeLabels[rejectFor.type]} · {rejectFor.creatorName} · {new Date(rejectFor.createdAt).toLocaleDateString('fa-IR')}
                </Typography>
              </Paper>
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
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setRejectFor(null)} color="inherit" variant="outlined">
            انصراف
          </Button>
          <Button
            onClick={handleRejectConfirm}
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

export default ApprovalQueue;