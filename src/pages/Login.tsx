import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  useTheme,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useAuthStore } from '../store/authStore';
import { mockUsers } from '../utils/mockData';
import toast from 'react-hot-toast';

const features = [
  { icon: <FactCheckIcon sx={{ color: '#2563eb' }} />, title: 'زنجیره تأیید هوشمند', desc: 'گردش کار تأیید چندمرحله‌ای' },
  { icon: <TimelineIcon sx={{ color: '#16a34a' }} />, title: 'تاریخچه کامل', desc: 'ردیابی تمام رویدادها و امضاها' },
  { icon: <RocketLaunchIcon sx={{ color: '#d97706' }} />, title: 'سریع و ساده', desc: 'ثبت درخواست در چند ثانیه' },
];

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock authentication (business logic preserved)
    const user = mockUsers.find((u) => u.email === email);
    if (user && password === '123456') {
      login('mock-jwt-token', user);
      toast.success(`خوش آمدید ${user.name}! 👋`);
      navigate('/dashboard');
    } else if (email && password && !mockUsers.some((u) => u.email === email)) {
      const newUser = {
        id: String(Date.now()),
        email,
        name: name || email.split('@')[0],
        role: 'employee' as const,
      };
      login('mock-jwt-token', newUser);
      toast.success('حساب جدید ایجاد شد! 👋');
      navigate('/dashboard');
    } else if (!email || !password) {
      setError('ایمیل و رمز عبور را وارد کنید');
    } else {
      setError('اطلاعات وارد شده صحیح نیست. از کاربران نمونه استفاده کنید یا ثبت‌نام کنید.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
      }}
    >
      {/* Left panel: branding */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flex: '1 1 50%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 8,
          color: 'white',
          background: 'linear-gradient(160deg, #1e40af 0%, #2563eb 55%, #3b82f6 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, zIndex: 1 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            F
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Freebuff
          </Typography>
        </Box>

        <Box sx={{ zIndex: 1, maxWidth: 460 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.4, mb: 2 }}>
            سیستم مدیریت درخواست‌ها و تأییدهای سازمانی
          </Typography>
          <Typography sx={{ opacity: 0.9, lineHeight: 2 }}>
            فرآیند تأیید درخواست‌های خود را دیجیتالی کنید؛ از ثبت تا امضای دیجیتال، همه در یک
            پلتفرم یکپارچه و امن.
          </Typography>

          <Box sx={{ mt: 6 }}>
            {features.map((f, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{f.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.75 }}>
                    {f.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Typography variant="caption" sx={{ opacity: 0.6, zIndex: 1 }}>
          © 2026 Freebuff — راهکار نرم‌افزاری گردش کار
        </Typography>

        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', top: -140, left: -120 }} />
        <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)', bottom: 60, right: -80 }} />
      </Box>

      {/* Right panel: form */}
      <Box
        sx={{
          flex: '1 1 50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          {/* Mobile logo */}
          <Box sx={{ display: { lg: 'none' }, textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: 'primary.main',
                mx: 'auto',
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: 28,
              }}
            >
              F
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Freebuff
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}
          >
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              {isRegistering ? 'ایجاد حساب کاربری' : 'ورود به حساب'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              {isRegistering
                ? 'برای شروع، اطلاعات خود را وارد کنید'
                : 'برای ادامه وارد حساب کاربری خود شوید'}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              {isRegistering && (
                <TextField
                  fullWidth
                  label="نام کامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="نام و نام خانوادگی"
                />
              )}
              <TextField
                fullWidth
                label="ایمیل"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="example@freebuff.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="رمز عبور"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 1 }}
                placeholder="••••••••"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, mt: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={<Typography variant="body2">مرا به خاطر بسپار</Typography>}
                />
                <Link href="#" variant="body2" underline="hover" sx={{ color: 'primary.main' }}>
                  فراموشی رمز عبور؟
                </Link>
              </Box>

              <Button type="submit" fullWidth variant="contained" size="large" sx={{ py: 1.4, fontWeight: 700 }}>
                {isRegistering ? 'ثبت‌نام' : 'ورود'}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 2.5 }}>
              <Typography variant="body2" color="text.secondary">
                {isRegistering ? 'حساب دارید؟' : 'حساب ندارید؟'}{' '}
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  underline="hover"
                  sx={{ color: 'primary.main', fontWeight: 600 }}
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                  }}
                >
                  {isRegistering ? 'ورود' : 'ثبت‌نام'}
                </Link>
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary">
                ورود سریع با حساب‌های نمونه
              </Typography>
            </Divider>

            <List dense disablePadding>
              {mockUsers.map((user) => (
                <ListItemButton
                  key={user.id}
                  onClick={() => {
                    setEmail(user.email);
                    setPassword('123456');
                    setError('');
                    toast('اطلاعات کاربر نمونه پر شد — رمز: 123456', { icon: 'ℹ️' });
                  }}
                  sx={{ borderRadius: 2, mb: 0.5, px: 1.5 }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        fontSize: 13,
                        bgcolor: user.role === 'admin' ? '#7c3aed' : user.role === 'supervisor' ? '#2563eb' : '#059669',
                      }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={
                      user.role === 'admin' ? 'مدیر' : user.role === 'supervisor' ? 'سرپرست' : 'کارمند'
                    }
                    primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }}
                    secondaryTypographyProps={{ fontSize: 11 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;