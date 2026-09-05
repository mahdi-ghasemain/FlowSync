import React, { useState } from 'react';
import { ApprovalRequest } from '../types';
import { typeLabels, statusLabels, statusColors } from '../utils/mockData';
import SignaturePad from './SignaturePad';
import toast from 'react-hot-toast';

interface ApprovalQueueProps {
  approvals: ApprovalRequest[];
  onApprove: (id: string, signature: string) => void;
  onReject: (id: string, comment: string) => void;
  onSelect: (id: string) => void;
}

const ApprovalQueue: React.FC<ApprovalQueueProps> = ({ approvals, onApprove, onReject, onSelect }) => {
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');

  const handleApproveClick = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setShowSignaturePad(true);
  };

  const handleRejectClick = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleSignatureConfirm = (signature: string) => {
    if (selectedRequest) {
      onApprove(selectedRequest.id, signature);
      toast.success('درخواست تأیید شد ✅');
    }
    setShowSignaturePad(false);
    setSelectedRequest(null);
  };

  const handleRejectConfirm = () => {
    if (selectedRequest && rejectComment.trim()) {
      onReject(selectedRequest.id, rejectComment);
      toast.success('درخواست رد شد ❌');
      setRejectComment('');
    }
    setShowRejectModal(false);
    setSelectedRequest(null);
  };

  const sortedApprovals = [...approvals].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">📋 در انتظار تأیید من</h2>
        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
          {approvals.length} درخواست
        </span>
      </div>

      {sortedApprovals.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-lg font-medium text-gray-600">هیچ درخواست در انتظاری ندارید</h3>
          <p className="text-gray-400 mt-2">تمام درخواست‌ها تأیید شده‌اند</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedApprovals.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 cursor-pointer" onClick={() => onSelect(request.id)}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {typeLabels[request.type]}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${statusColors[request.status]}`}>
                      {statusLabels[request.status]}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">{request.title}</h4>
                  <p className="text-sm text-gray-500 mb-2">{request.description}</p>
                  <div className="text-xs text-gray-400">
                    از: {request.creatorName} • {new Date(request.createdAt).toLocaleDateString('fa-IR')}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleRejectClick(request)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                  >
                    ❌ رد
                  </button>
                  <button
                    onClick={() => handleApproveClick(request)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition"
                  >
                    ✅ تأیید
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSignaturePad && selectedRequest && (
        <SignaturePad
          onSign={handleSignatureConfirm}
          onCancel={() => { setShowSignaturePad(false); setSelectedRequest(null); }}
        />
      )}

      {showRejectModal && selectedRequest && (
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
              <button
                onClick={() => { setShowRejectModal(false); setSelectedRequest(null); }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                انصراف
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectComment.trim()}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50"
              >
                رد درخواست
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalQueue;
