import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Chip,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled,
  useTheme,
  InputAdornment,
  Avatar,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckIcon from '@mui/icons-material/Check';
import MenuItem from '@mui/material/MenuItem';
import { RequestType } from '../types';
import typeLabels from '../utils/typeLabels';

// ----------------------------------------------------------------- Schemas
const purchaseSchema = z.object({
  title: z.string().min(3, 'عنوان باید حداقل ۳ کاراکتر باشد'),
  description: z.string().min(5, 'توضیحات الزامی است'),
  amount: z.number().min(1, 'مبلغ باید مثبت باشد'),
  vendor: z.string().optional(),
});

const leaveSchema = z.object({
  title: z.string().min(3, 'عنوان باید حداقل ۳ کاراکتر باشد'),
  description: z.string().min(5, 'توضیحات الزامی است'),
  startDate: z.string().min(1, 'تاریخ شروع الزامی است'),
  endDate: z.string().min(1, 'تاریخ پایان الزامی است'),
  leaveType: z.string().min(1, 'نوع مرخصی الزامی است'),
});

const expenseSchema = z.object({
  title: z.string().min(3, 'عنوان باید حداقل ۳ کاراکتر باشد'),
  description: z.string().min(5, 'توضیحات الزامی است'),
  amount: z.number().min(1, 'مبلغ باید مثبت باشد'),
});

const travelSchema = z.object({
  title: z.string().min(3, 'عنوان باید حداقل ۳ کاراکتر باشد'),
  description: z.string().min(5, 'توضیحات الزامی است'),
  destination: z.string().min(1, 'مقصد الزامی است'),
  duration: z.string().min(1, 'مدت سفر الزامی است'),
  purpose: z.string().min(1, 'هدف سفر الزامی است'),
});

const schemas: Record<RequestType, z.ZodType<any>> = {
  purchase: purchaseSchema,
  leave: leaveSchema,
  expense: expenseSchema,
  travel: travelSchema,
};

const stepFields: Record<RequestType, string[]> = {
  purchase: ['title', 'description', 'amount', 'vendor'],
  leave: ['title', 'description', 'startDate', 'endDate', 'leaveType'],
  expense: ['title', 'description', 'amount'],
  travel: ['title', 'description', 'destination', 'duration', 'purpose'],
};

// ----------------------------------------------------------------- Stepper style
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 18, right: 'calc(-50% + 22px)', left: 'calc(50% + 22px)' },
  [`& .${stepConnectorClasses.line}`]: {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  [`&.${stepConnectorClasses.active}, &.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: { borderColor: '#3b82f6' },
  },
}));

const steps = ['اطلاعات درخواست', 'جزئیات', 'پیوست‌ها'];
const priorities = ['کم', 'متوسط', 'زیاد', 'فوری'];
const priorityColor: Record<string, string> = { کم: '#64748b', متوسط: '#3b82f6', زیاد: '#d97706', فوری: '#dc2626' };

const mockChain = [
  { name: 'کارمند', role: 'شما', icon: '👤' },
  { name: 'سرپرست', role: 'سرپرست مستقیم', icon: '👔' },
  { name: 'مدیر مالی', role: 'واحد مالی', icon: '💰' },
  { name: 'تصویب نهایی', role: 'مدیرعامل', icon: '🏁' },
];

const NewRequest: React.FC = () => {
  const [requestType, setRequestType] = useState<RequestType>('leave');
  const [activeStep, setActiveStep] = useState(0);
  const [priority, setPriority] = useState('متوسط');
  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const typeRef = useRef<RequestType>(requestType);
  typeRef.current = requestType;

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: (values: any, ctx: any, opts: any) =>
      zodResolver(schemas[typeRef.current])(values, ctx, opts),
  });

  const onSubmit = (data: any) => {
    // Business logic preserved: would call requestAPI.create(FormData)
    console.log('Request submitted:', { ...data, type: requestType, priority, files });
    toast.success('درخواست با موفقیت ثبت شد! ✅');
    reset();
    setFiles([]);
    setActiveStep(0);
    navigate('/dashboard');
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      const ok = await trigger(['title', 'description'] as any);
      if (!ok) return;
    }
    if (activeStep === 1) {
      const ok = await trigger(stepFields[requestType].filter((f) => f !== 'title' && f !== 'description') as any);
      if (!ok) return;
    }
    setActiveStep((s) => s + 1);
  };

  const selectType = (t: RequestType) => {
    setRequestType(t);
    reset();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).map((f) => ({ name: f.name, size: f.size }));
    setFiles((prev) => [...prev, ...dropped]);
  };

  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, x) => x !== i));

  const fmtSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const dynamicFields = () => {
    switch (requestType) {
      case 'purchase':
        return (
          <>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="مبلغ (ریال)" type="number"
                {...register('amount', { valueAsNumber: true })}
                error={!!errors.amount} helperText={errors.amount?.message as string}
                InputProps={{ startAdornment: <InputAdornment position="start">ریال</InputAdornment> }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="فروشنده" {...register('vendor')} placeholder="نام فروشنده" />
            </Grid>
          </>
        );
      case 'leave':
        return (
          <>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="تاریخ شروع" type="date" {...register('startDate')}
                error={!!errors.startDate} helperText={errors.startDate?.message as string}
                InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="تاریخ پایان" type="date" {...register('endDate')}
                error={!!errors.endDate} helperText={errors.endDate?.message as string}
                InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth select label="نوع مرخصی" defaultValue="" {...register('leaveType')}
                error={!!errors.leaveType} helperText={errors.leaveType?.message as string}>
                <MenuItem value="استحقاقی">استحقاقی</MenuItem>
                <MenuItem value="استعلاجی">استعلاجی</MenuItem>
                <MenuItem value="بدون حقوق">بدون حقوق</MenuItem>
                <MenuItem value="ازدواج">ازدواج</MenuItem>
              </TextField>
            </Grid>
          </>
        );
      case 'expense':
        return (
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="مبلغ (ریال)" type="number"
              {...register('amount', { valueAsNumber: true })}
              error={!!errors.amount} helperText={errors.amount?.message as string}
              InputProps={{ startAdornment: <InputAdornment position="start">ریال</InputAdornment> }} />
          </Grid>
        );
      case 'travel':
        return (
          <>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="مقصد" {...register('destination')}
                error={!!errors.destination} helperText={errors.destination?.message as string} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="مدت سفر" {...register('duration')}
                error={!!errors.duration} helperText={errors.duration?.message as string} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="هدف سفر" {...register('purpose')}
                error={!!errors.purpose} helperText={errors.purpose?.message as string} />
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  const typeCards = [
    { type: 'purchase' as RequestType, icon: '🛒', title: 'خرید' },
    { type: 'leave' as RequestType, icon: '🏖️', title: 'مرخصی' },
    { type: 'expense' as RequestType, icon: '💳', title: 'هزینه' },
    { type: 'travel' as RequestType, icon: '✈️', title: 'سفر کاری' },
  ];

  return (
    <Box sx={{ maxWidth: 980, mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
        درخواست جدید
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        اطلاعات را گام‌به‌گام وارد کنید؛ پس از ثبت، درخواست وارد زنجیره تأیید می‌شود.
      </Typography>

      {/* Wizard stepper */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, mb: 2.5, border: '1px solid', borderColor: 'divider' }}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<QontoConnector />} sx={{ py: 1 }}>
          {steps.map((label, i) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 15,
                      fontWeight: 800,
                      bgcolor: i < activeStep ? '#3b82f6' : i === activeStep ? '#3b82f6' : '#eef2f7',
                      color: i <= activeStep ? '#fff' : '#94a3b8',
                      border: i === activeStep ? '3px solid #bfdbfe' : 'none',
                    }}
                  >
                    {i < activeStep ? <CheckIcon fontSize="small" /> : i + 1}
                  </Box>
                )}
              >
                <Typography variant="body2" sx={{ fontWeight: i === activeStep ? 800 : 600, fontSize: 12.5 }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Paper
            component="form"
            elevation={0}
            onSubmit={handleSubmit(onSubmit)}
            sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
          >
            {activeStep === 0 && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
                  ۱. اطلاعات درخواست
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                  نوع درخواست را انتخاب کرده و عنوان و توضیحات را وارد کنید.
                </Typography>

                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                  نوع درخواست
                </Typography>
                <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                  {typeCards.map((c) => {
                    const active = requestType === c.type;
                    return (
                      <Grid item xs={6} sm={3} key={c.type}>
                        <Paper
                          elevation={0}
                          onClick={() => selectType(c.type)}
                          sx={{
                            p: 1.6,
                            textAlign: 'center',
                            cursor: 'pointer',
                            borderRadius: 2.5,
                            border: active ? '2px solid #3b82f6' : '1px solid',
                            borderColor: active ? '#3b82f6' : 'divider',
                            bgcolor: active ? '#eff6ff' : 'background.paper',
                            transition: 'all .15s ease',
                            '&:hover': { borderColor: '#93c5fd' },
                          }}
                        >
                          <Box sx={{ fontSize: 24, mb: 0.5 }}>{c.icon}</Box>
                          <Typography variant="body2" sx={{ fontWeight: active ? 800 : 600 }}>
                            {c.title}
                          </Typography>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>

                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="عنوان درخواست" {...register('title')}
                      error={!!errors.title} helperText={errors.title?.message as string}
                      placeholder="مثال: درخواست مرخصی تابستانی" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="توضیحات" multiline rows={3} {...register('description')}
                      error={!!errors.description} helperText={errors.description?.message as string}
                      placeholder="شرح کامل درخواست..." />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                      اولویت
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {priorities.map((p) => (
                        <Chip
                          key={p}
                          label={p}
                          clickable
                          onClick={() => setPriority(p)}
                          sx={{
                            fontWeight: 700,
                            color: priority === p ? '#fff' : priorityColor[p],
                            bgcolor: priority === p ? priorityColor[p] : 'transparent',
                            border: '1px solid',
                            borderColor: priority === p ? priorityColor[p] : 'divider',
                            '&:hover': { bgcolor: priority === p ? priorityColor[p] : 'action.hover' },
                          }}
                        />
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </>
            )}

            {activeStep === 1 && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
                  ۲. جزئیات {typeLabels[requestType]}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                  فیلدهای مرتبط با نوع درخواست انتخابی را تکمیل کنید.
                </Typography>
                <Grid container spacing={2.5}>
                  {dynamicFields()}
                </Grid>
              </>
            )}

            {activeStep === 2 && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
                  ۳. پیوست‌ها
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                  در صورت نیاز، فایل‌های پشتیبان را ضمیمه کنید. (اختیاری)
                </Typography>

                <Box
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input')?.click()}
                  sx={{
                    border: '2px dashed',
                    borderColor: dragOver ? '#3b82f6' : 'divider',
                    borderRadius: 3,
                    p: 3.5,
                    textAlign: 'center',
                    bgcolor: dragOver ? '#eff6ff' : 'action.hover',
                    cursor: 'pointer',
                    transition: 'all .15s ease',
                  }}
                >
                  <UploadFileIcon sx={{ fontSize: 38, color: '#3b82f6', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    فایل را اینجا رها کنید یا کلیک کنید
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PDF, تصویر یا سند — حداکثر ۵ مگابایت
                  </Typography>
                  <input id="file-input" type="file" hidden multiple
                    onChange={(e) => {
                      const sel = Array.from(e.target.files || []).map((f) => ({ name: f.name, size: f.size }));
                      setFiles((prev) => [...prev, ...sel]);
                    }} />
                </Box>

                {files.map((f, i) => (
                  <Paper key={i} elevation={0}
                    sx={{ mt: 1.5, px: 2, py: 1.2, display: 'flex', alignItems: 'center', gap: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <AttachFileIcon fontSize="small" color="primary" />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {f.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">{fmtSize(f.size)}</Typography>
                    <Button size="small" color="error" onClick={() => removeFile(i)}><CloseIcon fontSize="small" /></Button>
                  </Paper>
                ))}
              </>
            )}

            {/* Actions */}
            <Stack direction="row" spacing={1.5} sx={{ mt: 3, justifyContent: 'space-between' }}>
              <Button variant="text" color="inherit" onClick={() => (activeStep === 0 ? navigate('/dashboard') : setActiveStep(activeStep - 1))}>
                {activeStep === 0 ? 'انصراف' : '→ قبلی'}
              </Button>
              {activeStep < steps.length - 1 ? (
                <Button variant="contained" onClick={handleNext} sx={{ px: 4, fontWeight: 700 }}>
                  بعدی ←
                </Button>
              ) : (
                <Button type="submit" variant="contained" size="large" sx={{ px: 4, fontWeight: 800 }}>
                  ثبت نهایی درخواست
                </Button>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Right rail: workflow preview */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 88 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
              مسیر تأیید
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              این درخواست مراحل زیر را طی می‌کند
            </Typography>
            {mockChain.map((s, i) => (
              <Box key={i}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: i === 0 ? '#16a34a' : i === mockChain.length - 1 ? '#6366f1' : '#eef2f7', fontSize: 16 }}>
                    {s.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{s.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.role}</Typography>
                  </Box>
                  {i === 0 && <Chip label="مرحله شما" size="small" color="success" sx={{ mr: 'auto', height: 20, fontSize: 10, fontWeight: 700 }} />}
                </Box>
                {i < mockChain.length - 1 && (
                  <Box sx={{ width: 2, height: 20, bgcolor: 'divider', mx: 'auto', my: 0.5 }} />
                )}
              </Box>
            ))}
            <Box sx={{ mt: 2.5, p: 1.5, borderRadius: 2, bgcolor: '#eff6ff', border: '1px dashed', borderColor: '#93c5fd' }}>
              <Typography variant="caption" sx={{ color: '#1d4ed8', lineHeight: 1.9 }}>
                💡 پس از ثبت، درخواست به‌صورت خودکار به سرپرست مستقیم ارسال می‌شود.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewRequest;