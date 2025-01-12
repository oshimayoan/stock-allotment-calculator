'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LOT_SIZE } from '@/constants';
import { calculateExponentialGrowthAllotment } from '@/lib/exponentialGrowth';
import { getPriceList } from '@/lib/utils';
import { TableEntry, useAllocationStore } from '@/stores/allocationStore';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const formSchema = yup.object({
  highPrice: yup.number().label('High Price').required(),
  lowPrice: yup
    .number()
    .label('Low Price')
    .required()
    .when('highPrice', (highPrice, schema) =>
      highPrice ? schema.max(highPrice[0]) : schema
    ),
  priceTick: yup.number().label('Price Tick').required().min(1),
  availableCapital: yup.number().label('Available Capital').required().min(1),
});

type FormData = yup.InferType<typeof formSchema>;

export function AllocationForm() {
  const { setTableData, setSummary } = useAllocationStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
  });

  const calculateAllocation = (data: FormData) => {
    const priceList = getPriceList(
      Number(data.lowPrice),
      Number(data.highPrice),
      Number(data.priceTick)
    );

    const result = calculateExponentialGrowthAllotment(
      Number(data.availableCapital),
      priceList
    );

    const tableData: TableEntry[] = [];

    for (const price in result.purchases) {
      const entry: TableEntry = {
        price: Number(price),
        allocationPercentage: result.purchases[price].percentage * 100,
        lots: result.purchases[price].lot,
        shares: result.purchases[price].lot * LOT_SIZE,
        totalCost: result.purchases[price].total,
        averagePurchasePrice: result.purchases[price].average,
      };

      tableData.push(entry);
    }

    setTableData(tableData.sort((a, b) => b.price - a.price));

    setSummary({
      totalCapitalUtilized: result.totalSum,
      remainingCash: Number(data.availableCapital) - result.totalSum,
      weightedAveragePrice: result.finalAverage,
      totalShares: tableData.reduce((sum, entry) => sum + entry.shares, 0),
    });
  };

  return (
    <form onSubmit={handleSubmit(calculateAllocation)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="highPrice">High Price</Label>
          <Input
            required
            {...register('highPrice')}
            id="highPrice"
            type="number"
            min={0}
            name="highPrice"
            placeholder="Enter high price"
          />
          {errors.highPrice && (
            <p className="text-red-500 text-sm">{errors.highPrice.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lowPrice">Low Price</Label>
          <Input
            required
            {...register('lowPrice')}
            id="lowPrice"
            type="number"
            min={0}
            name="lowPrice"
            placeholder="Enter low price"
          />
          {errors.lowPrice && (
            <p className="text-red-500 text-sm">{errors.lowPrice.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceTick">Price Tick</Label>
          <Input
            required
            {...register('priceTick')}
            id="priceTick"
            type="number"
            name="priceTick"
            placeholder="Enter price tick"
          />
          {errors.priceTick && (
            <p className="text-red-500 text-sm">{errors.priceTick.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="availableCapital">Available Capital</Label>
          <Input
            required
            {...register('availableCapital')}
            id="availableCapital"
            type="number"
            name="availableCapital"
            placeholder="Enter available capital"
          />
          {errors.availableCapital && (
            <p className="text-red-500 text-sm">
              {errors.availableCapital.message}
            </p>
          )}
        </div>
      </div>
      <Button className="mt-4" type="submit">
        Calculate Allocation
      </Button>
    </form>
  );
}
