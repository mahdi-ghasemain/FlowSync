import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  IconButton,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { mockRequests } from '../utils/mockData';
import RequestStatusBadge from '../components/ui/RequestStatusBadge';
import RequestTypeBadge from '../components/ui/RequestTypeBadge';
import EmptyState from '../components/ui/EmptyState';
import { RequestType } from '../types';

const PAGE_SIZE = 5;

const History: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let rows = mockRequests.filter((req) => {
      const q = search.trim();
      const codeMatch = (req.code || '').toLowerCase().includes(q.toLowerCase());
      const titleMatch = req.title.includes(q);
      const creatorMatch = req.creatorName.includes(q);
      const matchesSearch = !q || codeMatch || titleMatch || creatorMatch;
      const matchesType = filterType === 'all' || req.type === filterType;
      const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
    rows = [...rows].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return rows;
  }, [search, filterType, filterStatus]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const resetFilters = () => {
    setSearch('');
    setFilterType('all');
    setFilterStatus('all');
    setPage(0);
  };

  const from = filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1;
  const to = Math.min(filtered.length, (safePage + 1) * PAGE_SIZE);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
        درخواست‌های من
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        مدیریت و پیگیری تمام درخواست‌های ثبت‌شده شما
      </Typography>

      {/* Filter bar */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, mb: 2.5, border: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="جستجو با کد، عنوان یا نام..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField select fullWidth size="small" label="نوع" value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(0); }}>
              <MenuItem value="all">همه</MenuItem>
              <MenuItem value="purchase">خرید</MenuItem>
              <MenuItem value="leave">مرخصی</MenuItem>
              <MenuItem value="expense">هزینه</MenuItem>
              <MenuItem value="travel">سفر کاری</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField select fullWidth size="small" label="وضعیت" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}>
              <MenuItem value="all">همه</MenuItem>
              <MenuItem value="pending">در انتظار</MenuItem>
              <MenuItem value="approved">تأیید شده</MenuItem>
              <MenuItem value="rejected">رد شده</MenuItem>
              <MenuItem value="final_approved">تأیید نهایی</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            {(search || filterType !== 'all' || filterStatus !== 'all') && (
              <Button size="small" onClick={resetFilters} color="inherit">
                پاک کردن فیلترها
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="نتیجه‌ای یافت نشد"
            description="هیچ درخواستی با این فیلترها پیدا نشد. فیلترها را تغییر دهید."
            actionLabel="پاک کردن فیلترها"
            onAction={resetFilters}
          />
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>کد</TableCell>
                    <TableCell>عنوان</TableCell>
                    <TableCell>نوع</TableCell>
                    <TableCell>متقاضی</TableCell>
                    <TableCell>تاریخ</TableCell>
                    <TableCell>وضعیت</TableCell>
                    <TableCell align="left">عملیات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pageRows.map((req) => (
                    <TableRow key={req.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: 13 }}>
                        {req.code || req.id}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>{req.title}</TableCell>
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
                      <TableCell align="left">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon fontSize="small" />}
                          onClick={() => navigate(`/requests/${req.id}`)}
                        >
                          مشاهده
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box
              sx={{
                px: 2.5,
                py: 1.5,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12.5 }}>
                نمایش {from} تا {to} از {filtered.length}
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <IconButton size="small" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
                {Array.from({ length: pageCount }).slice(0, 5).map((_, i) => (
                  <Button
                    key={i}
                    size="small"
                    onClick={() => setPage(i)}
                    sx={{
                      minWidth: 34,
                      height: 34,
                      px: 0.5,
                      borderRadius: 1.5,
                      fontWeight: 700,
                      bgcolor: i === safePage ? 'primary.main' : 'transparent',
                      color: i === safePage ? '#fff' : 'text.secondary',
                      '&:hover': { bgcolor: i === safePage ? 'primary.main' : 'action.hover' },
                    }}
                  >
                    {i + 1}
                  </Button>
                ))}
                <IconButton size="small" disabled={safePage >= pageCount - 1} onClick={() => setPage(safePage + 1)}>
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default History;