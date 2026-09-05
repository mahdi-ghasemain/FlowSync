import React, { useRef, useState, useCallback } from 'react';

interface SignaturePadProps {
  onSign: (signature: string) => void;
  onCancel: () => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSign, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [typedName, setTypedName] = useState('');
  const [useTyped, setUseTyped] = useState(false);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return { canvas, ctx: canvas.getContext('2d')! };
  };

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const data = getCanvasContext();
    if (!data) return;
    const { canvas, ctx } = data;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const data = getCanvasContext();
    if (!data) return;
    const { canvas, ctx } = data;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = () => {
    const data = getCanvasContext();
    if (!data) return;
    data.ctx.clearRect(0, 0, data.canvas.width, data.canvas.height);
    setHasDrawn(false);
  };

  const handleConfirm = () => {
    if (useTyped && typedName.trim()) {
      onSign(typedName);
    } else if (canvasRef.current && hasDrawn) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onSign(dataUrl);
    }
  };

  const canConfirm = useTyped ? typedName.trim().length > 0 : hasDrawn;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">امضای دیجیتال</h3>
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setUseTyped(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${!useTyped ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            🖊️ رسم با ماوس
          </button>
          <button
            onClick={() => setUseTyped(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${useTyped ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            ⌨️ تایپ نام
          </button>
        </div>

        {!useTyped ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden mb-4">
            <canvas
              ref={canvasRef}
              width={380}
              height={150}
              className="w-full cursor-crosshair bg-white"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
        ) : (
          <div className="mb-4">
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="نام کامل خود را تایپ کنید..."
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-center text-lg font-bold text-primary-800 focus:border-primary-500 focus:outline-none"
            />
          </div>
        )}

        {!useTyped && (
          <button
            onClick={clearCanvas}
            className="w-full mb-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition"
          >
            پاک کردن
          </button>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            انصراف
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✅ تأیید امضا
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;
