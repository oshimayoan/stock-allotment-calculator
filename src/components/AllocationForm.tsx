'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LOT_SIZE } from '@/constants';
import { calculateExponentialGrowthAllotment } from '@/lib/exponentialGrowth';
import { getPriceList } from '@/lib/utils';
import { useState } from 'react';
import { TableEntry, useAllocationStore } from '@/stores/allocationStore';

export function AllocationForm() {
  const [highPrice, setHighPrice] = useState<string>('');
  const [lowPrice, setLowPrice] = useState<string>('');
  const [priceTick, setPriceTick] = useState<string>('');
  const [availableCapital, setAvailableCapital] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { setTableData, setSummary } = useAllocationStore();

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!highPrice || isNaN(Number(highPrice)) || Number(highPrice) <= 0) {
      newErrors.highPrice = 'Please enter a valid high price';
    }
    if (!lowPrice || isNaN(Number(lowPrice)) || Number(lowPrice) <= 0) {
      newErrors.lowPrice = 'Please enter a valid low price';
    }
    if (Number(lowPrice) >= Number(highPrice)) {
      newErrors.lowPrice = 'Low price must be less than high price';
    }
    if (!priceTick || isNaN(Number(priceTick)) || Number(priceTick) <= 0) {
      newErrors.priceTick = 'Please enter a valid price tick';
    }
    if (
      !availableCapital ||
      isNaN(Number(availableCapital)) ||
      Number(availableCapital) <= 0
    ) {
      newErrors.availableCapital = 'Please enter a valid available capital';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAllocation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInputs()) return;

    const priceList = getPriceList(
      Number(lowPrice),
      Number(highPrice),
      Number(priceTick)
    );

    const result = calculateExponentialGrowthAllotment(
      Number(availableCapital),
      priceList
    );

    const data: TableEntry[] = [];

    for (const price in result.purchases) {
      const entry: TableEntry = {
        price: Number(price),
        allocationPercentage: result.purchases[price].percentage * 100,
        lots: result.purchases[price].lot,
        shares: result.purchases[price].lot * LOT_SIZE,
        totalCost: result.purchases[price].total,
        averagePurchasePrice: result.purchases[price].average,
      };

      data.push(entry);
    }

    setTableData(data.sort((a, b) => b.price - a.price));

    setSummary({
      totalCapitalUtilized: result.totalSum,
      remainingCash: Number(availableCapital) - result.totalSum,
      weightedAveragePrice: result.finalAverage,
      totalShares: data.reduce((sum, entry) => sum + entry.shares, 0),
    });
  };

  return (
    <form onSubmit={calculateAllocation}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="highPrice">High Price</Label>
          <Input
            required
            id="highPrice"
            type="number"
            min={0}
            name="highPrice"
            value={highPrice}
            onChange={(e) => setHighPrice(e.target.value)}
            placeholder="Enter high price"
          />
          {errors.highPrice && (
            <p className="text-red-500 text-sm">{errors.highPrice}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lowPrice">Low Price</Label>
          <Input
            required
            id="lowPrice"
            type="number"
            min={0}
            name="lowPrice"
            value={lowPrice}
            onChange={(e) => setLowPrice(e.target.value)}
            placeholder="Enter low price"
          />
          {errors.lowPrice && (
            <p className="text-red-500 text-sm">{errors.lowPrice}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceTick">Price Tick</Label>
          <Input
            required
            id="priceTick"
            type="number"
            name="priceTick"
            value={priceTick}
            onChange={(e) => setPriceTick(e.target.value)}
            placeholder="Enter price tick"
          />
          {errors.priceTick && (
            <p className="text-red-500 text-sm">{errors.priceTick}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="availableCapital">Available Capital</Label>
          <Input
            required
            id="availableCapital"
            type="number"
            name="availableCapital"
            value={availableCapital}
            onChange={(e) => setAvailableCapital(e.target.value)}
            placeholder="Enter available capital"
          />
          {errors.availableCapital && (
            <p className="text-red-500 text-sm">{errors.availableCapital}</p>
          )}
        </div>
      </div>
      <Button className="mt-4" type="submit">
        Calculate Allocation
      </Button>
    </form>
  );
}
