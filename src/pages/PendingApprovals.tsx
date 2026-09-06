import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import { useRequestStore } from '../store/requestStore';
import { useAuthStore } from '../store/authStore';
import { mockRequests } from '../utils/mockData';
import ApprovalQueue from '../components/ApprovalQueue';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const PendingApprovals: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { pendingApprovals, setPendingApprovals } = useRequestStore();

  useEffect(() => {
    // Business logic preserved: would call approvalAPI.getPending()
    setPendingApprovals(mockRequests.filter((r) => r.status === 'pending'));
  }, [setPendingApprovals]);

  const handleApprove = (id: string, signature: string) => {
    // Business logic preserved: would call approvalAPI.approve(id, { signature })
    setPendingApprovals(pendingApprovals.filter((r) => r.id !== id));
    toast.success('درخواست با موفقیت تأیید شد ✅');
  };

  const handleReject = (id: string, comment: string) => {
    // Business logic preserved: would call approvalAPI.reject(id, { comment })
    setPendingApprovals(pendingApprovals.filter((r) => r.id !== id));
    toast.error('درخواست رد شد ❌');
  };

  const handleSelect = (id: string) => {
    navigate(`/requests/${id}`);
  };

  // Role-based access (business logic preserved)
  if (user?.role === 'employee') {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          maxWidth: 480,
          mx: 'auto',
          mt: 6,
          overflow: 'hidden',
        }}
      >
        <EmptyState
          icon="🔒"
          title="دسترسی محدود"
          description="شما به عنوان کارمند فقط می‌توانید درخواست ثبت کنید و درخواست‌های خود را ببینید. تأیید درخواست‌ها بر عهده سرپرستان است."
        />
      </Paper>
    );
  }

  const oldest = pendingApprovals.length
    ? new Date(Math.min(...pendingApprovals.map((r) => new Date(r.createdAt).getTime()))).toLocaleDateString('fa-IR')
    : '—';

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
          صف تأیید من
        </Typography>
        <Typography variant="body2" color="text.secondary">
          درخواست‌هایی که منتظر تأیید شما هستند — قدیمی‌ترین در ابتدا
        </Typography>
      </Box>

      {/* Summary chips */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ mb: 3 }}
        flexWrap="wrap"
      >
        <Chip
          label={`${pendingApprovals.length} در انتظار تأیید`}
          color="warning"
          sx={{ fontWeight: 700 }}
        />
        <Chip
          label={`قدیمی‌ترین درخواست: ${oldest}`}
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Stack>

      <ApprovalQueue
        approvals={pendingApprovals}
        onApprove={handleApprove}
        onReject={handleReject}
        onSelect={handleSelect}
      />
    </Box>
  );
};

export default PendingApprovals;