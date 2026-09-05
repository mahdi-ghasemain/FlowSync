import { ApprovalRequest, RequestDetail, User } from '../types';

export const mockUsers: User[] = [
  { id: '1', email: 'admin@freebuff.com', name: 'علی رضایی', role: 'admin' },
  { id: '2', email: 'supervisor@freebuff.com', name: 'محمد محمدی', role: 'supervisor' },
  { id: '3', email: 'employee@freebuff.com', name: 'رضا حسینی', role: 'employee' },
];

export const mockRequests: ApprovalRequest[] = [
  {
    id: 'req-1',
    title: 'درخواست خرید تجهیزات',
    type: 'purchase',
    description: 'خرید لپتاپ جدید برای تیم توسعه',
    status: 'pending',
    creatorId: '3',
    creatorName: 'رضا حسینی',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    currentStep: 0,
    formData: { amount: 50000000, item: 'لپتاپ Dell XPS', quantity: 2 },
  },
  {
    id: 'req-2',
    title: 'درخواست مرخصی',
    type: 'leave',
    description: 'مرخصی ۳ روزه به دلیل مسافرت',
    status: 'approved',
    creatorId: '3',
    creatorName: 'رضا حسینی',
    createdAt: '2024-01-14T08:00:00Z',
    updatedAt: '2024-01-14T14:00:00Z',
    currentStep: 2,
    formData: { startDate: '2024-02-01', endDate: '2024-02-03', reason: 'سفر خانوادگی' },
  },
  {
    id: 'req-3',
    title: 'درخواست بازپرداخت هزینه',
    type: 'expense',
    description: 'بازپرداخت هزینه بلیط پرواز',
    status: 'pending',
    creatorId: '2',
    creatorName: 'محمد محمدی',
    createdAt: '2024-01-13T09:00:00Z',
    updatedAt: '2024-01-13T09:00:00Z',
    currentStep: 0,
    formData: { amount: 2500000, description: 'بلیط پرواز تهران-اصفهان' },
  },
  {
    id: 'req-4',
    title: 'درخواست سفر کاری',
    type: 'travel',
    description: 'سفر به شعبه اصفهان',
    status: 'final_approved',
    creatorId: '3',
    creatorName: 'رضا حسینی',
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-01-12T16:00:00Z',
    currentStep: 3,
    formData: { destination: 'اصفهان', duration: '۳ روز', purpose: 'بازدید شعبه' },
  },
  {
    id: 'req-5',
    title: 'درخواست خرید نرم‌افزار',
    type: 'purchase',
    description: 'خرید لایسنس JetBrains',
    status: 'pending',
    creatorId: '3',
    creatorName: 'رضا حسینی',
    createdAt: '2024-01-16T12:00:00Z',
    updatedAt: '2024-01-16T12:00:00Z',
    currentStep: 0,
    formData: { amount: 15000000, item: 'JetBrains All Products Pack', quantity: 5 },
  },
];

export const mockRequestDetail: RequestDetail = {
  ...mockRequests[0],
  approvalChain: [
    { id: 'step-1', stepIndex: 0, approverName: 'محمد محمدی', approverRole: 'سرپرست', status: 'pending' },
    { id: 'step-2', stepIndex: 1, approverName: 'علی رضایی', approverRole: 'مدیر مالی', status: 'pending' },
    { id: 'step-3', stepIndex: 2, approverName: 'مدیرعامل', approverRole: 'مدیرعامل', status: 'pending' },
  ],
  auditLog: [
    { id: 'log-1', type: 'created', actorName: 'رضا حسینی', timestamp: '2024-01-15T10:30:00Z', details: 'درخواست ایجاد شد' },
  ],
};

export const typeLabels: Record<string, string> = {
  purchase: 'خرید',
  leave: 'مرخصی',
  expense: 'بازپرداخت هزینه',
  travel: 'سفر کاری',
};

export const statusLabels: Record<string, string> = {
  pending: 'در انتظار',
  approved: 'تأیید شده',
  rejected: 'رد شده',
  final_approved: 'تأیید نهایی',
};

export const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  final_approved: 'bg-green-100 text-green-800',
};
