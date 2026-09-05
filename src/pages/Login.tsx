import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { mockUsers } from '../utils/mockData';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    const user = mockUsers.find(u => u.email === email);
    if (user && password === '123456') {
      login('mock-jwt-token', user);
      toast.success(`خوش آمدید ${user.name}! 👋`);
      navigate('/dashboard');
    } else if (email && password) {
      // Auto-create user for demo
      const newUser = {
        id: String(Date.now()),
        email,
        name: name || email.split('@')[0],
        role: 'employee' as const,
      };
      login('mock-jwt-token', newUser);
      toast.success(`حساب جدید ایجاد شد! 👋`);
      navigate('/dashboard');
    } else {
      toast.error('ایمیل و رمز عبور را وارد کنید');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Freebuff</h1>
          <p className="text-primary-200 mt-2">سیستم مدیریت درخواست‌ها و تأییدها</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
            {isRegistering ? 'ثبت‌نام' : 'ورود'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                  placeholder="نام کامل"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                placeholder="example@freebuff.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-200"
            >
              {isRegistering ? 'ثبت‌نام' : 'ورود'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-primary-600 text-sm hover:underline"
            >
              {isRegistering ? 'حساب دارید؟ ورود کنید' : 'حساب ندارید؟ ثبت‌نام کنید'}
            </button>
          </div>

          {/* Demo users */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2 text-center">کاربران نمونه (رمز: 123456)</p>
            <div className="space-y-1">
              {mockUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => { setEmail(user.email); setPassword('123456'); }}
                  className="w-full text-right text-xs px-3 py-2 bg-white rounded border border-gray-200 hover:border-primary-300 transition"
                >
                  <span className="font-medium">{user.name}</span>
                  <span className="text-gray-400 mr-2">{user.role === 'admin' ? '🔑 مدیر' : user.role === 'supervisor' ? '👔 سرپرست' : '👤 کارمند'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
