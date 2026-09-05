import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRequestStore } from '../store/requestStore';
import { mockRequests, typeLabels, statusLabels, statusColors } from '../utils/mockData';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { requests, setRequests } = useRequestStore();
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedTodayCount, setApprovedTodayCount] = useState(0);

  useEffect(() => {
    setRequests(mockRequests);
    setPendingCount(mockRequests.filter(r => r.status === 'pending').length);
    setApprovedTodayCount(mockRequests.filter(r => r.status === 'approved' || r.status === 'final_approved').length);
  }, [setRequests]);

  const recentRequests = requests.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <h1 className="text-xl font-bold text-gray-800">Freebuff</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-left">
              <div className="text-sm font-medium text-gray-700">{user?.name}</div>
              <div className="text-xs text-gray-400">
                {user?.role === 'admin' ? '🔑 مدیر' : user?.role === 'supervisor' ? '👔 سرپرست' : '👤 کارمند'}
              </div>
            </div>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-red-500 transition text-sm"
            >
              🚪 خروج
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          سلام {user?.name}! 👋
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">در انتظار تأیید من</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">⏳</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">تأیید شده‌ها</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{approvedTodayCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">✅</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">کل درخواست‌ها</p>
                <p className="text-3xl font-bold text-primary-600 mt-1">{requests.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">📄</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Requests */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">📋 درخواست‌های اخیر</h3>
              <button
                onClick={() => navigate('/history')}
                className="text-sm text-primary-600 hover:underline"
              >
                مشاهده همه
              </button>
            </div>
            {recentRequests.length === 0 ? (
              <p className="text-gray-400 text-center py-8">هنوز درخواستی ثبت نشده</p>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => navigate(`/requests/${req.id}`)}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                  >
                    <div>
                      <div className="font-medium text-sm text-gray-800">{req.title}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {typeLabels[req.type]} • {new Date(req.createdAt).toLocaleDateString('fa-IR')}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${statusColors[req.status]}`}>
                      {statusLabels[req.status]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/requests/new')}
              className="w-full bg-primary-600 text-white py-4 rounded-xl font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-200 flex items-center justify-center gap-2"
            >
              ✏️ ثبت درخواست جدید
            </button>

            {(user?.role === 'supervisor' || user?.role === 'admin') && (
              <button
                onClick={() => navigate('/approvals')}
                className="w-full bg-green-500 text-white py-4 rounded-xl font-medium hover:bg-green-600 transition shadow-lg shadow-green-200 flex items-center justify-center gap-2"
              >
                ✅ در انتظار تأیید من
              </button>
            )}

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-3">📊 آمار سریع</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">درخواست‌های امروز</span>
                  <span className="font-medium">۲</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">تأیید شده امروز</span>
                  <span className="font-medium text-green-600">{approvedTodayCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">در انتظار</span>
                  <span className="font-medium text-yellow-600">{pendingCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
