import { createTheme, Theme } from '@mui/material/styles';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';

// ---------------------------------------------------------------------------
// RTL cache for Emotion (Persian UI)
// ---------------------------------------------------------------------------
export const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});

// ---------------------------------------------------------------------------
// Typography: Vazirmatn for Persian, Inter fallback for English
// ---------------------------------------------------------------------------
const fontFamily = [
  'Vazirmatn',
  'Inter',
  'Segoe UI',
  'Tahoma',
  'Arial',
  'sans-serif',
].join(',');

// Modern enterprise blue
const primary = {
  main: '#3b82f6',
  light: '#93c5fd',
  dark: '#2563eb',
  contrastText: '#ffffff',
};

const baseTheme = (mode: 'light' | 'dark'): Theme =>
  createTheme({
    direction: 'rtl',
    palette: {
      mode,
      primary,
      background: {
        default: mode === 'light' ? '#f0f4f8' : '#0b1220',
        paper: mode === 'light' ? '#ffffff' : '#141d2e',
      },
      text: {
        primary: mode === 'light' ? '#1e2530' : '#e5eaf2',
        secondary: mode === 'light' ? '#6b7a90' : '#94a3b8',
      },
      divider: mode === 'light' ? '#e6ebf1' : '#2a3850',
      success: { main: '#16a34a', light: '#dcfce7', dark: '#15803d' },
      warning: { main: '#d97706', light: '#fef3c7', dark: '#b45309' },
      error: { main: '#dc2626', light: '#fee2e2', dark: '#b91c1c' },
      info: { main: '#3b82f6', light: '#dbeafe', dark: '#1d4ed8' },
    },
    typography: {
      fontFamily,
      h1: { fontWeight: 800 },
      h2: { fontWeight: 800 },
      h3: { fontWeight: 800 },
      h4: { fontWeight: 800 },
      h5: { fontWeight: 800 },
      h6: { fontWeight: 700 },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
      body2: { lineHeight: 1.7 },
    },
    shape: { borderRadius: 12 },
    shadows: [
      'none',
      '0 1px 2px rgba(16,24,40,.06)',
      '0 1px 3px rgba(16,24,40,.1)',
      '0 4px 6px -1px rgba(16,24,40,.1), 0 2px 4px -1px rgba(16,24,40,.06)',
      '0 8px 12px -2px rgba(16,24,40,.12), 0 3px 6px -2px rgba(16,24,40,.08)',
      '0 12px 16px -4px rgba(16,24,40,.14), 0 4px 6px -2px rgba(16,24,40,.08)',
      '0 16px 24px -4px rgba(16,24,40,.16), 0 6px 8px -2px rgba(16,24,40,.1)',
      ...Array(18).fill('0 10px 30px rgba(16,24,40,.12)'),
    ] as Theme['shadows'],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 1px 2px rgba(16,24,40,.05), 0 1px 3px rgba(16,24,40,.08)',
            border: `1px solid ${mode === 'light' ? '#e9edf3' : '#26344b'}`,
            transition: 'box-shadow .2s ease, transform .2s ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              backgroundColor: mode === 'light' ? '#ffffff' : '#101a2b',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 500 },
        },
      },
      MuiListItemButton: {
        styleOverrides: { root: { borderRadius: 10 } },
      },
      MuiDialog: {
        styleOverrides: { paper: { borderRadius: 16 } },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 700,
            fontSize: 12.5,
            color: mode === 'light' ? '#64748b' : '#94a3b8',
          },
        },
      },
      MuiToolbar: {
        styleOverrides: { root: { minHeight: 64 } },
      },
      MuiMenu: {
        styleOverrides: { paper: { borderRadius: 12 } },
      },
    },
  });

export const lightTheme = baseTheme('light');
export const darkTheme = baseTheme('dark');
