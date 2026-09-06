import { ApprovalRequest, RequestDetail, User } from '../types';

export const mockUsers: User[] = [
  { id: '1', email: 'admin@freebuff.com', name: 'علی رضایی', role: 'admin' },
  { id: '2', email: 'supervisor@freebuff.com', name: 'محمد محمدی', role: 'supervisor' },
  { id: '3', email: 'employee@freebuff.com', name: 'رضا حسینی', role: 'employee' },
];

export const applicants = ['سارا محمدی', 'رضا احمدی', 'علی کریمی', 'فاطمه حسینی', 'محمد جعفری', 'زهرا موسوی'];

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(now - h * 3600000).toISOString();

export const mockRequests: ApprovalRequest[] = [
  {
    id: 'req-1',
    code: 'REQ-1047',
    title: 'درخواست مرخصی تابستانی',
    type: 'leave',
    description: 'مرخصی استحقاقی ۵ روزه از تاریخ ۵ تا ۹ اردیبهشت',
    status: 'pending',
    creatorId: '3',
    creatorName: 'سارا محمدی',
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
    currentStep: 1,
    formData: { startDate: '2025-05-05', endDate: '2025-05-09', reason: 'سفر خانوادگی', leaveType: 'استحقاقی' },
  },
  {
    id: 'req-2',
    code: 'REQ-1046',
    title: 'درخواست خرید لپ‌تاپ',
    type: 'purchase',
    description: 'خرید لپ‌تاپ برای تیم توسعه — Dell XPS 13',
    status: 'approved',
    creatorId: '3',
    creatorName: 'رضا احمدی',
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
    currentStep: 3,
    formData: { amount: 85000000, item: 'Dell XPS 13', quantity: 1, vendor: 'تکنولوژی پارس' },
  },
  {
    id: 'req-3',
    code: 'REQ-1045',
    title: 'درخواست خرید تجهیزات اداری',
    type: 'purchase',
    description: 'خرید صندلی اداری ارگونومیک برای واحد فنی',
    status: 'pending',
    creatorId: '2',
    creatorName: 'علی کریمی',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    currentStep: 1,
    formData: { amount: 32000000, item: 'صندلی ارگونومیک', quantity: 4, vendor: 'تجهیزات مدرن' },
  },
  {
    id: 'req-4',
    code: 'REQ-1044',
    title: 'درخواست بازپرداخت هزینه سفر',
    type: 'expense',
    description: 'بازپرداخت هزینه بلیط پرواز تهران - مشهد',
    status: 'rejected',
    creatorId: '3',
    creatorName: 'فاطمه حسینی',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    currentStep: 2,
    formData: { amount: 4200000, description: 'بلیط پرواز رفت و برگشت' },
  },
  {
    id: 'req-5',
    code: 'REQ-1043',
    title: 'درخواست مرخصی استعلاجی',
    type: 'leave',
    description: 'مرخصی استعلاجی همراه با گواهی پزشکی',
    status: 'approved',
    creatorId: '3',
    creatorName: 'محمد جعفری',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    currentStep: 3,
    formData: { startDate: '2025-04-20', endDate: '2025-04-22', reason: 'بیماری', leaveType: 'استعلاجی' },
  },
  {
    id: 'req-6',
    code: 'REQ-1042',
    title: 'درخواست سفر کاری به اصفهان',
    type: 'travel',
    description: 'بازدید از شعبه اصفهان و جلسه با مشتری',
    status: 'pending',
    creatorId: '2',
    creatorName: 'زهرا موسوی',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    currentStep: 1,
    formData: { destination: 'اصفهان', duration: '۳ روز', purpose: 'جلسه با مشتری' },
  },
  {
    id: 'req-7',
    code: 'REQ-1041',
    title: 'خرید نرم‌افزار مدیریت پروژه',
    type: 'purchase',
    description: 'لایسنس سالانه نرم‌افزار مدیریت پروژه برای ۱۰ کاربر',
    status: 'pending',
    creatorId: '3',
    creatorName: 'سارا محمدی',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
    currentStep: 0,
    formData: { amount: 12800000, item: 'لایسنس نرم‌افزار', quantity: 10, vendor: 'شرکت نرم‌افزاری آوا' },
  },
  {
    id: 'req-8',
    code: 'REQ-1040',
    title: 'درخواست اینترنت خانگی',
    type: 'expense',
    description: 'بازپرداخت هزینه اینترنت پرسرعت ماه جاری',
    status: 'final_approved',
    creatorId: '3',
    creatorName: 'علی کریمی',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2),
    currentStep: 3,
    formData: { amount: 1200000, description: 'اینترنت خانگی' },
  },
  {
    id: 'req-9',
    code: 'REQ-1039',
    title: 'مرخصی بدون حقوق',
    type: 'leave',
    description: 'مرخصی بدون حقوق به مدت یک ماه برای ادامه تحصیل',
    status: 'approved',
    creatorId: '2',
    creatorName: 'فاطمه حسینی',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
    currentStep: 3,
    formData: { startDate: '2025-06-01', endDate: '2025-06-30', reason: 'تحصیل', leaveType: 'بدون حقوق' },
  },
];

export const activityFeed = [
  { id: 'a1', code: 'REQ-1047', text: 'درخواست مرخصی ثبت شد', meta: 'سارا محمدی', time: hoursAgo(2), type: 'submit' },
  { id: 'a2', code: 'REQ-1046', text: 'تأیید شد توسط سرپرست', meta: 'محمد محمدی', time: hoursAgo(4), type: 'approve' },
  { id: 'a3', code: 'REQ-1045', text: 'رد شد توسط واحد مالی', meta: 'علی رضایی', time: hoursAgo(5), type: 'reject' },
  { id: 'a4', code: 'REQ-1044', text: 'به واحد مالی ارجاع شد', meta: 'سیستم', time: hoursAgo(6), type: 'forward' },
  { id: 'a5', code: 'REQ-1043', text: 'تأیید نهایی انجام شد', meta: 'مدیرعامل', time: hoursAgo(8), type: 'approve' },
];

export const timeAgo = (d: number | string) => {
  const t = typeof d === 'string' ? new Date(d).getTime() : d;
  const diff = Math.max(0, now - t);
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'چند لحظه پیش';
  if (h < 24) return `${h} ساعت پیش`;
  return `${Math.floor(h / 24)} روز پیش`;
};

export const mockRequestDetail: RequestDetail = {
  ...mockRequests[0],
  approvalChain: [
    { id: 'step-1', stepIndex: 0, approverName: 'محمد محمدی', approverRole: 'سرپرست', status: 'approved', timestamp: hoursAgo(20), comment: 'تأیید شد' },
    { id: 'step-2', stepIndex: 1, approverName: 'علی رضایی', approverRole: 'مدیر مالی', status: 'pending' },
    { id: 'step-3', stepIndex: 2, approverName: 'مدیرعامل', approverRole: 'تصویب نهایی', status: 'pending' },
  ],
  auditLog: [
    { id: 'log-1', type: 'created', actorName: 'سارا محمدی', timestamp: hoursAgo(20), details: 'درخواست مرخصی ایجاد شد' },
    { id: 'log-2', type: 'approved', actorName: 'محمد محمدی', timestamp: hoursAgo(18), details: 'مرحله سرپرست با موفقیت تأیید شد' },
    { id: 'log-3', type: 'forwarded', actorName: 'سیستم', timestamp: hoursAgo(18), details: 'درخواست به مدیر مالی ارسال شد' },
  ],
};

export const typeLabels: Record<string, string> = {
  purchase: 'خرید',
  leave: 'مرخصی',
  expense: 'هزینه',
  travel: 'سفر کاری',
};

export const statusLabels: Record<string, string> = {
  pending: 'در انتظار',
  approved: 'تأیید شده',
  rejected: 'رد شده',
  final_approved: 'تأیید نهایی',
};

export const statusColors: Record<string, string> = {
  pending: '#b45309',
  approved: '#15803d',
  rejected: '#b91c1c',
  final_approved: '#1d4ed8',
};
