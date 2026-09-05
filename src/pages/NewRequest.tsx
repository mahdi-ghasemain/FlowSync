import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import ApprovalChainVisualizer from '../components/ApprovalChainVisualizer';
import { ApprovalStep, RequestType } from '../types';

const purchaseSchema = z.object({
  title: z.string().min(3, 'عنوان باید حداقل ۳ کاراکتر باشد'),
  description: z.string().min(5, 'توضیحات الزامی است'),
  amount: z.number().min(1, 'مبلغ باید مثبت باشد'),
  item: z.string().min(1, 'نام کالا الزامی است'),
  quantity: z.number().min(1, 'تعداد باید حداقل ۱ باشد'),
});

const leaveSchema = z.object({
  title: z.string().min(3, 'عنوان باید حداقل ۳ کاراکتر باشد'),
  description: z.string().min(5, 'توضیحات الزامی است'),
  startDate: z.string().min(1, 'تاریخ شروع الزامی است'),
  endDate: z.string().min(1, 'تاریخ پایان الزامی است'),
  reason: z.string().min(1, 'دلیل مرخصی الزامی است'),
});

const expenseSchema = z.object({
  title: z.string().min(3, 'عنوان باید حداقل ۳ کاراکتر باشد'),
  description: z.string().min(5, 'توضیحات الزامی است'),
  amount: z.number().min(1, 'مبلغ باید مثبت باشد'),
});

const travelSchema = z.object({
  title: z.string().min(3, 'عنوان باید حداقل ۳ کاراکتر باشد'),
  description: z.string().min(5, 'توضیحات الزامی است'),
  destination: z.string().min(1, 'مقصد الزامی است'),
  duration: z.string().min(1, 'مدت سفر الزامی است'),
  purpose: z.string().min(1, 'هدف سفر الزامی است'),
});

const schemas: Record<RequestType, any> = {
  purchase: purchaseSchema,
  leave: leaveSchema,
  expense: expenseSchema,
  travel: travelSchema,
};

const typeLabels: Record<RequestType, string> = {
  purchase: 'خرید',
  leave: 'مرخصی',
  expense: 'بازپرداخت هزینه',
  travel: 'سفر کاری',
};

const mockChain: ApprovalStep[] = [
  { id: 's1', stepIndex: 0, approverName: 'سرپرست مستقیم', approverRole: 'سرپرست', status: 'pending' },
  { id: 's2', stepIndex: 1, approverName: 'مدیر مالی', approverRole: 'مدیر مالی', status: 'pending' },
  { id: 's3', stepIndex: 2, approverName: 'مدیرعامل', approverRole: 'مدیرعامل', status: 'pending' },
];

const NewRequest: React.FC = () => {
  const [requestType, setRequestType] = useState<RequestType>('purchase');
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schemas[requestType]),
  });

  const onSubmit = (data: any) => {
    console.log('Request submitted:', { ...data, type: requestType, file });
    toast.success('درخواست با موفقیت ثبت شد! ✅');
    reset();
    navigate('/dashboard');
  };

  const renderFields = () => {
    switch (requestType) {
      case 'purchase':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">مبلغ (ریال)</label>
              <input type="number" {...register('amount', { valueAsNumber: true })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" placeholder="50000000" />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نام کالا</label>
              <input type="text" {...register('item')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" placeholder="نام کالا" />
              {errors.item && <p className="text-red-500 text-xs mt-1">{errors.item.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تعداد</label>
              <input type="number" {...register('quantity', { valueAsNumber: true })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" placeholder="1" />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message as string}</p>}
            </div>
          </>
        );
      case 'leave':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ شروع</label>
              <input type="date" {...register('startDate')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ پایان</label>
              <input type="date" {...register('endDate')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">دلیل</label>
              <input type="text" {...register('reason')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" placeholder="دلیل مرخصی" />
              {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason.message as string}</p>}
            </div>
          </>
        );
      case 'expense':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مبلغ (ریال)</label>
            <input type="number" {...register('amount', { valueAsNumber: true })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" placeholder="2500000" />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message as string}</p>}
          </div>
        );
      case 'travel':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">مقصد</label>
              <input type="text" {...register('destination')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" placeholder="اصفهان" />
              {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">مدت سفر</label>
              <input type="text" {...register('duration')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" placeholder="۳ روز" />
              {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">هدف سفر</label>
              <input type="text" {...register('purpose')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" placeholder="بازدید شعبه" />
              {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose.message as string}</p>}
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-700">➡️ بازگشت</button>
          <h1 className="text-xl font-bold text-gray-800">✏️ ثبت درخواست جدید</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              {/* Request Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع درخواست</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(typeLabels) as RequestType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRequestType(type)}
                      className={`py-3 px-4 rounded-lg text-sm font-medium transition border-2 ${
                        requestType === type
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {typeLabels[type]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Common Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عنوان درخواست</label>
                  <input type="text" {...register('title')} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" placeholder="عنوان درخواست" />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
                  <textarea {...register('description')} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none" placeholder="توضیحات درخواست" />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>}
                </div>

                {/* Type-specific fields */}
                {renderFields()}

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">فایل پیوست (اختیاری)</label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  />
                  {file && <p className="text-xs text-green-600 mt-1">📎 {file.name}</p>}
                </div>
              </div>

              <button type="submit" className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-200">
                📤 ارسال درخواست
              </button>
            </form>
          </div>

          {/* Sidebar - Preview */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">👁️ پیش‌نمایش زنجیره تأیید</h3>
              <ApprovalChainVisualizer steps={mockChain} currentStep={0} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewRequest;
