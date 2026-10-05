import * as yup from 'yup';

export const MAX_PRICE_LEVELS = 500;

export const formSchema = yup.object({
  highPrice: yup
    .number()
    .label('High Price')
    .typeError('High Price must be a number')
    .required('High Price is required')
    .positive('High Price must be greater than 0')
    .integer('High Price must be a whole number (IDR)'),
  lowPrice: yup
    .number()
    .label('Low Price')
    .typeError('Low Price must be a number')
    .required('Low Price is required')
    .positive('Low Price must be greater than 0')
    .integer('Low Price must be a whole number (IDR)')
    .when('highPrice', (values, schema) => {
      const highPrice = Array.isArray(values) ? values[0] : values;
      return typeof highPrice === 'number'
        ? schema.max(highPrice, 'Low Price must not exceed High Price')
        : schema;
    }),
  priceTick: yup
    .number()
    .label('Price Tick')
    .typeError('Price Tick must be a number')
    .required('Price Tick is required')
    .integer('Price Tick must be a whole number')
    .min(1, 'Price Tick must be at least 1')
    .test(
      'max-price-levels',
      `Too many price levels (max ${MAX_PRICE_LEVELS}). Increase the Price Tick or narrow the range.`,
      function () {
        const { highPrice, lowPrice, priceTick } = this.parent ?? {};

        if (
          typeof highPrice === 'number' &&
          typeof lowPrice === 'number' &&
          typeof priceTick === 'number' &&
          highPrice >= lowPrice &&
          priceTick >= 1
        ) {
          const levels = Math.floor((highPrice - lowPrice) / priceTick) + 1;
          return levels <= MAX_PRICE_LEVELS;
        }

        return true;
      }
    ),
  availableCapital: yup
    .number()
    .label('Available Capital')
    .typeError('Available Capital must be a number')
    .required('Available Capital is required')
    .integer('Available Capital must be a whole number (IDR)')
    .min(1, 'Available Capital must be greater than 0'),
});

export type AllocationFormData = yup.InferType<typeof formSchema>;
