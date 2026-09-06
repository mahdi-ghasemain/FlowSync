import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Switch,
  Chip,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import PersonIcon from '@mui/icons-material/Person';
import PaletteIcon from '@mui/icons-material/Palette';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuthStore } from '../store/authStore';
import { useThemeStore, ThemeMode } from '../store/themeStore';
import toast from 'react-hot-toast';

const roleLabels: Record<string, string> = {
  admin: 'مدیر سیستم',
  supervisor: 'سرپرست',
  employee: 'کارمند',
};

const Settings: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { mode, setMode } = useThemeStore();
  const [notif, setNotif] = React.useState(true);

  const options: { value: ThemeMode; label: string; desc: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'روشن', desc: 'تم روشن و شفاف', icon: <LightModeIcon /> },
    { value: 'dark', label: 'تیره', desc: 'تم تیره برای محیط‌های کم‌نور', icon: <DarkModeIcon /> },
    { value: 'system', label: 'سیستم', desc: 'هماهنگ با تنظیمات دستگاه', icon: <SettingsBrightnessIcon /> },
  ];

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
        تنظیمات
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        تنظیمات حساب کاربری و نمایش برنامه
      </Typography>

      {/* Profile */}
      <Paper elevation={0} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
            حساب کاربری
          </Typography>
        </Box>
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.light', fontSize: 26 }}>
            {user?.name?.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Chip
              label={user ? roleLabels[user.role] : ''}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mt: 0.8, fontWeight: 600 }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Appearance */}
      <Paper elevation={0} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PaletteIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            نمایش
          </Typography>
        </Box>
        <Stack spacing={1} sx={{ p: 2 }}>
          {options.map((opt) => (
            <Paper
              key={opt.value}
              elevation={0}
              onClick={() => {
                setMode(opt.value);
                toast.success(`تم ${opt.label} فعال شد`);
              }}
              sx={{
                p: 2,
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: mode === opt.value ? 'primary.main' : 'divider',
                bgcolor: mode === opt.value ? 'primary.light' + '14' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  bgcolor: mode === opt.value ? 'primary.main' : 'action.hover',
                  color: mode === opt.value ? 'white' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {opt.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {opt.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {opt.desc}
                </Typography>
              </Box>
              {mode === opt.value && (
                <Chip label="فعال" size="small" color="primary" sx={{ fontWeight: 700, height: 22 }} />
              )}
            </Paper>
          ))}
        </Stack>
      </Paper>

      {/* Notifications */}
      <Paper elevation={0} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <List disablePadding>
          <ListItem sx={{ px: 3, py: 2 }}>
            <ListItemIcon>
              <NotificationsIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1" sx={{ fontWeight: 700 }}>اعلان‌های ایمیل</Typography>}
              secondary="هنگام تغییر وضعیت درخواست‌های شما، ایمیل دریافت کنید"
              secondaryTypographyProps={{ variant: 'caption' }}
            />
            <Switch
              checked={notif}
              onChange={(e) => setNotif(e.target.checked)}
              color="primary"
            />
          </ListItem>
          <Divider />
          <ListItem sx={{ px: 3, py: 2 }}>
            <ListItemIcon>
              <PersonIcon color="error" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1" sx={{ fontWeight: 700, color: 'error.main' }}>خروج از حساب</Typography>}
              secondary="از این دستگاه خارج شوید"
              secondaryTypographyProps={{ variant: 'caption' }}
            />
            <Chip label="خروج" size="small" color="error" onClick={logout} clickable sx={{ fontWeight: 700 }} />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default Settings;