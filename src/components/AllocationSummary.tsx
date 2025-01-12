'use client';

import { useAllocationStore } from '@/stores/allocationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { LOT_SIZE } from '@/constants';

export function AllocationSummary() {
  const summary = useAllocationStore((state) => state.summary);

  if (!summary) {
    return null;
  }

  return (
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
  );
}
