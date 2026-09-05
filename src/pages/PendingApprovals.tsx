import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequestStore } from '../store/requestStore';
import { useAuthStore } from '../store/authStore';
import { mockRequests } from '../utils/mockData';
import ApprovalQueue from '../components/ApprovalQueue';
import toast from 'react-hot-toast';

const PendingApprovals: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { pendingApprovals, setPendingApprovals } = useRequestStore();

  useEffect(() => {
    // In real app, would call approvalAPI.getPending()
    setPendingApprovals(mockRequests.filter(r => r.status === 'pending'));
  }, [setPendingApprovals]);

  const handleApprove = (id: string, signature: string) => {
    // In real app, would call approvalAPI.approve()
    setPendingApprovals(pendingApprovals.filter(r => r.id !== id));
  };

  const handleReject = (id: string, comment: string) => {
    // In real app, would call approvalAPI.reject()
    setPendingApprovals(pendingApprovals.filter(r => r.id !== id));
  };

  if (user?.role === 'employee') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-800">دسترسی محدود</h2>
          <p className="text-gray-500 mt-2">شما اجازه دسترسی به این بخش را ندارید</p>
          <button onClick={() => navigate('/dashboard')} className="mt-4 text-primary-600 hover:underline">
            بازگشت به داشبورد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-700">➡️ بازگشت</button>
          <h1 className="text-xl font-bold text-gray-800">📋 در انتظار تأیید من</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ApprovalQueue
          approvals={pendingApprovals}
          onApprove={handleApprove}
          onReject={handleReject}
          onSelect={(id) => navigate(`/requests/${id}`)}
        />
      </main>
    </div>
  );
};

export default PendingApprovals;
