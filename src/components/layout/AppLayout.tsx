import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Badge,
  Stack,
  TextField,
  InputAdornment,
  alpha,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore, ThemeMode } from '../../store/themeStore';

const SIDEBAR_WIDTH = 264;
const SIDEBAR_BG = '#1e2530';

const navItems = [
  { key: 'dash', label: 'داشبورد', icon: <DashboardIcon />, path: '/dashboard' },
  { key: 'mine', label: 'درخواست‌های من', icon: <AssignmentIcon />, path: '/history' },
  { key: 'new', label: 'درخواست جدید', icon: <AddCircleIcon />, path: '/requests/new' },
  { key: 'approvals', label: 'تأیید در انتظار', icon: <FactCheckIcon />, path: '/approvals', badge: 3 },
  { key: 'history', label: 'تاریخچه', icon: <HistoryIcon />, path: '/history?tab=archive' },
  { key: 'settings', label: 'تنظیمات', icon: <SettingsIcon />, path: '/settings' },
];

const roleLabels: Record<string, string> = {
  admin: 'مدیر سیستم',
  supervisor: 'سرپرست',
  employee: 'کارمند',
};

const roleEnLabels: Record<string, string> = {
  admin: 'Admin',
  supervisor: 'Supervisor',
  employee: 'Employee',
};

const roleColors: Record<string, string> = {
  admin: '#8b5cf6',
  supervisor: '#3b82f6',
  employee: '#10b981',
};

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { mode, setMode } = useThemeStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const [themeAnchor, setThemeAnchor] = useState<null | HTMLElement>(null);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      navigate(`/history?q=${encodeURIComponent(search)}`);
      setMobileOpen(false);
    }
  };

  const themeModes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'روشن', icon: <LightModeIcon fontSize="small" /> },
    { value: 'dark', label: 'تیره', icon: <DarkModeIcon fontSize="small" /> },
    { value: 'system', label: 'سیستم', icon: <SettingsBrightnessIcon fontSize="small" /> },
  ];

  const activeLabel = navItems.find((n) => n.path.split('?')[0] === location.pathname)?.label;

  const sidebarContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: SIDEBAR_BG,
        color: '#e5eaf2',
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 20,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          ✓
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 18, lineHeight: 1.2, color: '#fff' }}>
            Freebuff
          </Typography>
          <Typography variant="caption" sx={{ color: '#8b96a8', fontSize: 11 }}>
            سیستم گردش کار
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,.08)' }} />

      {/* Nav */}
      <Box sx={{ px: 1.5, py: 2, flex: 1, overflowY: 'auto' }}>
        <Typography
          sx={{
            px: 1.5,
            mb: 1,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '.08em',
            color: '#6b7688',
          }}
        >
          منو
        </Typography>
        <List sx={{ py: 0 }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path.split('?')[0];
            return (
              <ListItemButton
                key={item.key}
                onClick={() => handleNav(item.path)}
                sx={{
                  mb: 0.4,
                  py: 1,
                  px: 1.5,
                  borderRadius: 2,
                  bgcolor: active ? '#3b82f6' : 'transparent',
                  color: active ? '#fff' : '#aab4c5',
                  '&:hover': {
                    bgcolor: active ? '#3b82f6' : 'rgba(255,255,255,.06)',
                    color: active ? '#fff' : '#e5eaf2',
                  },
                  transition: 'all .15s ease',
                }}
              >
                <ListItemIcon
                  sx={{ minWidth: 38, color: 'inherit' }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 13.5, fontWeight: active ? 700 : 500 }}
                />
                {item.badge ? (
                  <Box
                    sx={{
                      minWidth: 20,
                      height: 20,
                      borderRadius: 999,
                      bgcolor: '#ef4444',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      px: 0.6,
                    }}
                  >
                    {item.badge}
                  </Box>
                ) : null}
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* User profile bottom */}
      <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <ListItemButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: 2,
            '&:hover': { bgcolor: 'rgba(255,255,255,.06)' },
          }}
        >
          <Avatar sx={{ width: 38, height: 38, bgcolor: roleColors[user?.role || 'employee'], fontSize: 15 }}>
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ ml: 1.5, minWidth: 0, flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#8b96a8' }}>
              {user ? roleEnLabels[user.role] : ''} · {user ? roleLabels[user.role] : ''}
            </Typography>
          </Box>
          <KeyboardArrowDownIcon sx={{ color: '#8b96a8', fontSize: 18 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Desktop sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, bgcolor: SIDEBAR_BG, border: 'none' },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, bgcolor: SIDEBAR_BG },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* TopBar */}
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{ bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Toolbar sx={{ gap: 1, px: { xs: 1.5, md: 3 } }}>
            <IconButton sx={{ display: { md: 'none' } }} onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>

            {/* Search */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <TextField
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="جستجوی درخواست‌ها، کاربران..."
                sx={{
                  maxWidth: 420,
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 999,
                    bgcolor: 'action.hover',
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: '1px solid', borderColor: 'primary.main' },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Right side utilities */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              <Tooltip title="تغییر تم">
                <IconButton size="small" onClick={(e) => setThemeAnchor(e.currentTarget)}>
                  {mode === 'light' ? <LightModeIcon /> : mode === 'dark' ? <DarkModeIcon /> : <SettingsBrightnessIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="اعلان‌ها">
                <IconButton size="small" onClick={(e) => setNotifAnchor(e.currentTarget)}>
                  <Badge badgeContent={9} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 700 } }}>
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, display: { xs: 'none', md: 'flex' } }} />

            {/* User */}
            <Box
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', py: 0.5, px: 1, borderRadius: 2, '&:hover': { bgcolor: 'action.hover' } }}
            >
              <Avatar sx={{ width: 34, height: 34, bgcolor: roleColors[user?.role || 'employee'], fontSize: 14 }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                  {user ? roleEnLabels[user.role] : ''}
                </Typography>
              </Box>
              <KeyboardArrowDownIcon sx={{ color: 'text.secondary', fontSize: 18, display: { xs: 'none', lg: 'block' } }} />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 3 },
            maxWidth: 1440,
            width: '100%',
            mx: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>

      {/* User menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem
          onClick={() => { setAnchorEl(null); navigate('/settings'); }}
        >
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          تنظیمات
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
          خروج از حساب
        </MenuItem>
      </Menu>

      {/* Theme menu */}
      <Menu anchorEl={themeAnchor} open={Boolean(themeAnchor)} onClose={() => setThemeAnchor(null)}>
        {themeModes.map((m) => (
          <MenuItem key={m.value} selected={mode === m.value} onClick={() => { setMode(m.value); setThemeAnchor(null); }}>
            <ListItemIcon>{m.icon}</ListItemIcon>
            {m.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Notifications menu */}
      <Menu anchorEl={notifAnchor} open={Boolean(notifAnchor)} onClose={() => setNotifAnchor(null)} sx={{ minWidth: 320 }}>
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>اعلان‌ها</Typography>
        </Box>
        <MenuItem onClick={() => { setNotifAnchor(null); navigate('/approvals'); }}>
          <ListItemText
            primary="درخواست جدید برای تأیید"
            secondary="REQ-1047 · درخواست مرخصی"
            primaryTypographyProps={{ fontSize: 13, fontWeight: 700 }}
            secondaryTypographyProps={{ fontSize: 12 }}
          />
        </MenuItem>
        <MenuItem onClick={() => { setNotifAnchor(null); navigate('/history'); }}>
          <ListItemText
            primary="درخواست تأیید شد"
            secondary="REQ-1046 · توسط سرپرست"
            primaryTypographyProps={{ fontSize: 13, fontWeight: 700 }}
            secondaryTypographyProps={{ fontSize: 12 }}
          />
        </MenuItem>
        <MenuItem onClick={() => { setNotifAnchor(null); navigate('/history'); }}>
          <ListItemText
            primary="درخواست رد شد"
            secondary="REQ-1045 · توسط واحد مالی"
            primaryTypographyProps={{ fontSize: 13, fontWeight: 700 }}
            secondaryTypographyProps={{ fontSize: 12 }}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AppLayout;