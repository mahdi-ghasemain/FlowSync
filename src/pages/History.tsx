import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockRequests, typeLabels, statusLabels, statusColors } from '../utils/mockData';

const History: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredRequests = useMemo(() => {
    return mockRequests.filter((req) => {
      const matchesSearch = req.title.includes(search) || req.description.includes(search);
      const matchesType = filterType === 'all' || req.type === filterType;
      const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [search, filterType, filterStatus]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-700">➡️ بازگشت</button>
          <h1 className="text-xl font-bold text-gray-800">📜 تاریخچه درخواست‌ها</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 جستجو..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
              >
                <option value="all">همه انواع</option>
                <option value="purchase">خرید</option>
                <option value="leave">مرخصی</option>
                <option value="expense">بازپرداخت هزینه</option>
                <option value="travel">سفر کاری</option>
              </select>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="pending">در انتظار</option>
                <option value="approved">تأیید شده</option>
                <option value="rejected">رد شده</option>
                <option value="final_approved">تأیید نهایی</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="text-sm text-gray-500 mb-4">{filteredRequests.length} نتیجه یافت شد</div>

        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-600">نتیجه‌ای یافت نشد</h3>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500">
              <div>عنوان</div>
              <div>نوع</div>
              <div>وضعیت</div>
              <div>تاریخ</div>
              <div>عملیات</div>
            </div>
            {/* Rows */}
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer"
                onClick={() => navigate(`/requests/${req.id}`)}
              >
                <div className="font-medium text-gray-800">{req.title}</div>
                <div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {typeLabels[req.type]}
                  </span>
                </div>
                <div>
                  <span className={`text-xs px-2 py-1 rounded ${statusColors[req.status]}`}>
                    {statusLabels[req.status]}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(req.createdAt).toLocaleDateString('fa-IR')}
                </div>
                <div>
                  <span className="text-primary-600 text-sm hover:underline">مشاهده</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
