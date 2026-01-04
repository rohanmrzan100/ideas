import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PLAN_TYPE } from './enums';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getPlanColor = (plan: PLAN_TYPE) => {
  switch (plan) {
    case 'enterprise':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'pro':
      return 'bg-brand/10 text-brand border-brand/20';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};
