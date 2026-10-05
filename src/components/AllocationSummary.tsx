'use client';

import type { LucideIcon } from 'lucide-react';
import { Layers, PiggyBank, Target, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { LOT_SIZE } from '@/constants';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { useAllocationStore } from '@/stores/allocationStore';

type Stat = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
};

export function AllocationSummary() {
  const summary = useAllocationStore((state) => state.summary);

  const totalLots = summary ? Math.round(summary.totalShares / LOT_SIZE) : 0;
  const utilization =
    summary && summary.totalCapitalUtilized + summary.remainingCash > 0
      ? (summary.totalCapitalUtilized /
          (summary.totalCapitalUtilized + summary.remainingCash)) *
        100
      : 0;

  const stats: Stat[] = summary
    ? [
        {
          label: 'Capital Utilized',
          value: formatCurrency(summary.totalCapitalUtilized),
          hint: `${utilization.toFixed(1)}% of available capital`,
          icon: Wallet,
        },
        {
          label: 'Remaining Cash',
          value: formatCurrency(summary.remainingCash),
          hint: 'Unspent after flooring to whole lots',
          icon: PiggyBank,
        },
        {
          label: 'Final Avg Purchase Price',
          value: formatCurrency(summary.weightedAveragePrice),
          hint: 'Weighted across all price levels',
          icon: Target,
        },
        {
          label: 'Total Shares',
          value: formatNumber(summary.totalShares),
          hint: `${formatNumber(totalLots)} lots of ${LOT_SIZE} shares`,
          icon: Layers,
        },
      ]
    : [
        {
          label: 'Capital Utilized',
          value: '—',
          hint: 'Awaiting valid inputs',
          icon: Wallet,
        },
        {
          label: 'Remaining Cash',
          value: '—',
          hint: 'Awaiting valid inputs',
          icon: PiggyBank,
        },
        {
          label: 'Final Avg Purchase Price',
          value: '—',
          hint: 'Awaiting valid inputs',
          icon: Target,
        },
        {
          label: 'Total Shares',
          value: '—',
          hint: 'Awaiting valid inputs',
          icon: Layers,
        },
      ];

  return (
    <section aria-label="Allocation summary">
      <div aria-live="polite" className="sr-only">
        {summary
          ? `Allocation updated. Final average purchase price ${formatCurrency(
              summary.weightedAveragePrice
            )}, total shares ${formatNumber(summary.totalShares)}.`
          : ''}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map(({ label, value, hint, icon: Icon }) => (
          <Card
            key={label}
            className={summary ? undefined : 'border-dashed shadow-none'}
          >
            <CardContent className="flex items-start gap-3 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 truncate text-lg font-semibold tabular-nums">
                  {value}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {hint}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
