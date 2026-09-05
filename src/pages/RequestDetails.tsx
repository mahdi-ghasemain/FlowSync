import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRequestStore } from '../store/requestStore';
import { useAuthStore } from '../store/authStore';
import { mockRequestDetail, typeLabels, statusLabels, statusColors } from '../utils/mockData';
import ApprovalChainVisualizer from '../components/ApprovalChainVisualizer';
import AuditTimeline from '../components/AuditTimeline';
import SignaturePad from '../components/SignaturePad';
import toast from 'react-hot-toast';

const RequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentRequest, setCurrentRequest } = useRequestStore();
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    // In real app, would call requestAPI.getById(id)
    setCurrentRequest(mockRequestDetail);
    return () => setCurrentRequest(null);
  }, [id, setCurrentRequest]);

  const canApprove = user?.role === 'supervisor' || user?.role === 'admin';

  const handleApprove = (signature: string) => {
    toast.success('درخواست تأیید شد! ✅');
    setShowSignaturePad(false);
    setApproved(true);
  };

  const handleReject = () => {
    if (rejectComment.trim()) {
      toast.success('درخواست رد شد ❌');
      setShowRejectModal(false);
      setRejectComment('');
    }
  };

  if (!currentRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">➡️ بازگشت</button>
          <h1 className="text-xl font-bold text-gray-800">📄 جزئیات درخواست</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Final Approval Banner */}
        {(approved || currentRequest.status === 'final_approved') && (
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl mb-6 flex items-center gap-3 shadow-lg">
            <span className="text-2xl">🎉</span>
            <div>
              <div className="font-bold">تأیید نهایی شد!</div>
              <div className="text-sm text-green-100">این درخواست توسط تمام تأییدکنندگان تأیید شده است</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {typeLabels[currentRequest.type]}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${statusColors[currentRequest.status]}`}>
                      {statusLabels[currentRequest.status]}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{currentRequest.title}</h2>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{currentRequest.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-400 block">ایجاد کننده</span>
                  <span className="font-medium">{currentRequest.creatorName}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-400 block">تاریخ ایجاد</span>
                  <span className="font-medium">{new Date(currentRequest.createdAt).toLocaleDateString('fa-IR')}</span>
                </div>
                {currentRequest.formData.amount && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-400 block">مبلغ</span>
                    <span className="font-medium">{currentRequest.formData.amount.toLocaleString('fa-IR')} ریال</span>
                  </div>
                )}
                {currentRequest.formData.destination && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-400 block">مقصد</span>
                    <span className="font-medium">{currentRequest.formData.destination}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <AuditTimeline events={currentRequest.auditLog} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Approval Chain */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <ApprovalChainVisualizer steps={currentRequest.approvalChain} currentStep={currentRequest.currentStep} />
            </div>

            {/* Action Buttons */}
            {canApprove && currentRequest.status === 'pending' && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-3">
                <h3 className="font-bold text-gray-800 mb-3">⚡ عملیات</h3>
                <button
                  onClick={() => setShowSignaturePad(true)}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition"
                >
                  ✅ تأیید با امضای دیجیتال
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-medium hover:bg-red-100 transition"
                >
                  ❌ رد درخواست
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Signature Pad Modal */}
      {showSignaturePad && (
        <SignaturePad
          onSign={handleApprove}
          onCancel={() => setShowSignaturePad(false)}
        />
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">رد درخواست</h3>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="دلیل رد را وارد کنید..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-primary-500 focus:outline-none resize-none"
              rows={3}
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowRejectModal(false)} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition">
                انصراف
              </button>
              <button onClick={handleReject} disabled={!rejectComment.trim()} className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50">
                رد درخواست
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetails;
