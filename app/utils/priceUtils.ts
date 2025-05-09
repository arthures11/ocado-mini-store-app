import type { PriceFormat } from '../types';

export const getPriceAsNumber = (price: PriceFormat): number => {
    return price.main + price.fractional / 100;
};

export const formatPriceDisplay = (price: PriceFormat | number): string => {
    if (typeof price === 'number') {
        return price.toFixed(2);
    }
    return `${price.main}.${String(price.fractional).padStart(2, '0')}`;
};
