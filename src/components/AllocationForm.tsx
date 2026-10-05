'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CircleAlert, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/NumberInput';
import { LOT_SIZE } from '@/constants';
import { calculateExponentialGrowthAllotment } from '@/lib/exponentialGrowth';
import { formatCurrency, getPriceList } from '@/lib/utils';
import {
  AllocationFormData,
  MAX_PRICE_LEVELS,
  formSchema,
} from '@/lib/validation';
import { TableEntry, useAllocationStore } from '@/stores/allocationStore';

const DEFAULT_VALUES: AllocationFormData = {
  highPrice: 5000,
  lowPrice: 3000,
  priceTick: 50,
  availableCapital: 100_000_000,
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="flex items-center gap-1.5 text-sm text-destructive">
      <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

export function AllocationForm() {
  const setTableData = useAllocationStore((state) => state.setTableData);
  const setSummary = useAllocationStore((state) => state.setSummary);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AllocationFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  const highPrice = watch('highPrice');
  const lowPrice = watch('lowPrice');
  const priceTick = watch('priceTick');
  const availableCapital = watch('availableCapital');

  const runCalculation = useCallback(
    (data: AllocationFormData) => {
      const priceList = getPriceList(
        Number(data.lowPrice),
        Number(data.highPrice),
        Number(data.priceTick)
      );

      const result = calculateExponentialGrowthAllotment(
        Number(data.availableCapital),
        priceList
      );

      const tableData: TableEntry[] = Object.entries(result.purchases).map(
        ([price, purchase]) => ({
          price: Number(price),
          allocationPercentage: purchase.percentage * 100,
          lots: purchase.lot,
          shares: purchase.lot * LOT_SIZE,
          totalCost: purchase.total,
          averagePurchasePrice: purchase.average,
        })
      );

      tableData.sort((a, b) => b.price - a.price);

      setTableData(tableData);
      setSummary({
        totalCapitalUtilized: result.totalSum,
        remainingCash: Number(data.availableCapital) - result.totalSum,
        weightedAveragePrice: result.finalAverage,
        totalShares: tableData.reduce((sum, entry) => sum + entry.shares, 0),
      });
    },
    [setTableData, setSummary]
  );

  const isFirstRun = useRef(true);

  // Recalculate automatically (debounced) while the inputs stay valid.
  // The first run is immediate so results are ready on load.
  useEffect(() => {
    const delay = isFirstRun.current ? 0 : 300;
    isFirstRun.current = false;

    const timer = setTimeout(() => {
      try {
        const data = formSchema.validateSync(
          { highPrice, lowPrice, priceTick, availableCapital },
          { abortEarly: false }
        ) as AllocationFormData;
        runCalculation(data);
      } catch {
        // Keep showing the last valid result while the inputs are invalid.
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [highPrice, lowPrice, priceTick, availableCapital, runCalculation]);

  const priceLevelPreview = (() => {
    if (
      typeof highPrice !== 'number' ||
      typeof lowPrice !== 'number' ||
      typeof priceTick !== 'number' ||
      highPrice <= 0 ||
      lowPrice <= 0 ||
      priceTick < 1 ||
      highPrice < lowPrice
    ) {
      return null;
    }

    const levels = Math.floor((highPrice - lowPrice) / priceTick) + 1;
    if (levels < 1 || levels > MAX_PRICE_LEVELS) {
      return null;
    }

    return { levels };
  })();

  const hasErrors = Object.keys(errors).length > 0;
  const onSubmit = handleSubmit((data) => runCalculation(data));

  const handleReset = () => {
    reset(DEFAULT_VALUES);
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="space-y-2">
          <Label htmlFor="highPrice">High Price</Label>
          <Controller
            name="highPrice"
            control={control}
            render={({ field }) => (
              <NumberInput
                id="highPrice"
                name={field.name}
                ref={field.ref}
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                prefix="Rp"
                placeholder="e.g. 5.000"
                invalid={!!errors.highPrice}
                aria-describedby={
                  errors.highPrice ? 'highPrice-error' : undefined
                }
              />
            )}
          />
          <FieldError
            id="highPrice-error"
            message={errors.highPrice?.message}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lowPrice">Low Price</Label>
          <Controller
            name="lowPrice"
            control={control}
            render={({ field }) => (
              <NumberInput
                id="lowPrice"
                name={field.name}
                ref={field.ref}
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                prefix="Rp"
                placeholder="e.g. 3.000"
                invalid={!!errors.lowPrice}
                aria-describedby={
                  errors.lowPrice ? 'lowPrice-error' : undefined
                }
              />
            )}
          />
          <FieldError id="lowPrice-error" message={errors.lowPrice?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceTick">Price Tick</Label>
          <Controller
            name="priceTick"
            control={control}
            render={({ field }) => (
              <NumberInput
                id="priceTick"
                name={field.name}
                ref={field.ref}
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="e.g. 50"
                invalid={!!errors.priceTick}
                aria-describedby={
                  errors.priceTick ? 'priceTick-error' : undefined
                }
              />
            )}
          />
          <FieldError id="priceTick-error" message={errors.priceTick?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="availableCapital">Available Capital</Label>
          <Controller
            name="availableCapital"
            control={control}
            render={({ field }) => (
              <NumberInput
                id="availableCapital"
                name={field.name}
                ref={field.ref}
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                prefix="Rp"
                placeholder="e.g. 100.000.000"
                invalid={!!errors.availableCapital}
                aria-describedby={
                  errors.availableCapital ? 'availableCapital-error' : undefined
                }
              />
            )}
          />
          <FieldError
            id="availableCapital-error"
            message={errors.availableCapital?.message}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button type="submit">Calculate Now</Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {hasErrors
          ? 'Fix the highlighted fields to update the results.'
          : priceLevelPreview
            ? `${priceLevelPreview.levels} price levels from ${formatCurrency(
                lowPrice
              )} up to ${formatCurrency(highPrice)}. Results update as you type.`
            : 'Results update automatically as you type.'}
      </p>
    </form>
  );
}
