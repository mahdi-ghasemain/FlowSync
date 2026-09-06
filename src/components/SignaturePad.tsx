import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  useTheme,
} from '@mui/material';
import DrawIcon from '@mui/icons-material/Draw';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ClearIcon from '@mui/icons-material/Clear';

interface SignaturePadProps {
  open: boolean;
  onSign: (signature: string) => void;
  onCancel: () => void;
  title?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ open, onSign, onCancel, title = 'امضای دیجیتال' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [typedName, setTypedName] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      setMode('draw');
      setTypedName('');
      setHasDrawn(false);
      // Initialize canvas after dialog opens
      setTimeout(() => clearCanvas(), 60);
    }
  }, [open]);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d')!;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = theme.palette.mode === 'dark' ? '#93c5fd' : '#1e3a8a';
    return { canvas, ctx };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const getPos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const data = getCanvasContext();
    if (!data) return;
    const { x, y } = getPos(e);
    data.ctx.beginPath();
    data.ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  }, [theme.palette.mode]);

  const draw = useCallback((e: React.PointerEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const data = getCanvasContext();
    if (!data) return;
    const { x, y } = getPos(e);
    data.ctx.lineTo(x, y);
    data.ctx.stroke();
  }, [isDrawing, theme.palette.mode]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleConfirm = () => {
    if (mode === 'type' && typedName.trim()) {
      onSign(typedName);
    } else if (canvasRef.current && hasDrawn) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onSign(dataUrl);
    }
  };

  const canConfirm = mode === 'type' ? typedName.trim().length > 0 : hasDrawn;

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, v) => v && setMode(v)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="draw">
            <DrawIcon fontSize="small" sx={{ mr: 1 }} /> رسم با ماوس
          </ToggleButton>
          <ToggleButton value="type">
            <KeyboardIcon fontSize="small" sx={{ mr: 1 }} /> تایپ نام
          </ToggleButton>
        </ToggleButtonGroup>

        {mode === 'draw' ? (
          <>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: 'background.default',
                touchAction: 'none',
              }}
            >
              <canvas
                ref={canvasRef}
                width={560}
                height={180}
                style={{ width: '100%', height: 180, cursor: 'crosshair', display: 'block', touchAction: 'none' }}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button size="small" startIcon={<ClearIcon fontSize="small" />} onClick={clearCanvas} color="inherit">
                پاک کردن
              </Button>
            </Box>
          </>
        ) : (
          <TextField
            fullWidth
            autoFocus
            label="نام کامل"
            placeholder="نام و نام خانوادگی خود را بنویسید"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            sx={{
              '& input': { fontSize: 22, textAlign: 'center', fontWeight: 700, fontFamily: 'cursive, Vazirmatn' },
              mb: 1,
            }}
          />
        )}

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          با امضای خود، صحت این تأیید را می‌پذیرید.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit">
          انصراف
        </Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!canConfirm} sx={{ fontWeight: 700 }}>
          ✅ تأیید امضا
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignaturePad;