import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPriceList(
  lowPrice: number,
  highPrice: number,
  priceTick: number
) {
  const priceList: number[] = [];

  for (let i = lowPrice; i <= highPrice; i += priceTick) {
    priceList.push(i);
  }

  return priceList.reverse();
}

export function formatCurrency(value: number, locale = 'id-ID') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
