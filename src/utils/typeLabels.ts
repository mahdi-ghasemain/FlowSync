import { RequestType } from '../types';

const typeLabels: Record<RequestType, string> = {
  purchase: 'خرید',
  leave: 'مرخصی',
  expense: 'بازپرداخت هزینه',
  travel: 'سفر کاری',
};

export default typeLabels;