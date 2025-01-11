'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle } from 'lucide-react';
import { calculateExponentialGrowthAllotment } from '@/lib/exponentialGrowth';
import { getPriceList } from '@/lib/utils';
import { LOT_SIZE } from '@/constants';

interface TableEntry {
  price: number;
  allocationPercentage: number;
  lots: number;
  shares: number;
  totalCost: number;
  averagePurchasePrice: number;
}

export default function StockTradingCalculator() {
  const [highPrice, setHighPrice] = useState<string>('');
  const [lowPrice, setLowPrice] = useState<string>('');
  const [priceTick, setPriceTick] = useState<string>('');
  const [availableCapital, setAvailableCapital] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [tableData, setTableData] = useState<TableEntry[]>([]);
  const [summary, setSummary] = useState<{
    totalCapitalUtilized: number;
    remainingCash: number;
    weightedAveragePrice: number;
    totalShares: number;
  } | null>(null);

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

  const calculateAllocation = () => {
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="container mx-auto p-4 space-y-6 pb-40">
      <h1 className="text-2xl font-bold mb-4">
        Stock Trading Allocation Calculator
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Input Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="highPrice">High Price</Label>
              <Input
                id="highPrice"
                type="number"
                min={0}
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
                id="lowPrice"
                type="number"
                min={0}
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
                id="priceTick"
                type="number"
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
                id="availableCapital"
                type="number"
                value={availableCapital}
                onChange={(e) => setAvailableCapital(e.target.value)}
                placeholder="Enter available capital"
              />
              {errors.availableCapital && (
                <p className="text-red-500 text-sm">
                  {errors.availableCapital}
                </p>
              )}
            </div>
          </div>
          <Button className="mt-4" onClick={calculateAllocation}>
            Calculate Allocation
          </Button>
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="font-semibold">Total Capital Utilized:</p>
                <p>{formatCurrency(summary.totalCapitalUtilized)}</p>
              </div>
              <div>
                <p className="font-semibold">Remaining Available Cash:</p>
                <p>{formatCurrency(summary.remainingCash)}</p>
              </div>
              <div>
                <p className="font-semibold">Final Average Purchase Price:</p>
                <p>{formatCurrency(summary.weightedAveragePrice)}</p>
              </div>
              <div>
                <p className="font-semibold">Total Shares:</p>
                <p>
                  {summary.totalShares} ({summary.totalShares / LOT_SIZE} lot)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {tableData.length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Allocation Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Price per Share</TableHead>
                      <TableHead>Allocation %</TableHead>
                      <TableHead>Lots</TableHead>
                      <TableHead>Shares</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Avg Purchase Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatCurrency(entry.price)}</TableCell>
                        <TableCell>
                          {entry.allocationPercentage.toFixed(2)}%
                        </TableCell>
                        <TableCell>{entry.lots}</TableCell>
                        <TableCell>{entry.shares}</TableCell>
                        <TableCell>{formatCurrency(entry.totalCost)}</TableCell>
                        <TableCell>
                          {formatCurrency(entry.averagePurchasePrice || 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <div className="flex items-center space-x-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              <p>
                Please enter valid inputs and click Calculate Allocation to
                generate the table and summary.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
