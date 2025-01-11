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
