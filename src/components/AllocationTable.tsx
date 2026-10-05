'use client';

import { useMemo, useState } from 'react';
import { AlertCircle, Check, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { downloadCsv, tableDataToCsv } from '@/lib/csv';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { useAllocationStore } from '@/stores/allocationStore';

export function AllocationTable() {
  const tableData = useAllocationStore((state) => state.tableData);
  const [copied, setCopied] = useState(false);

  const maxAllocation = useMemo(
    () => Math.max(...tableData.map((entry) => entry.allocationPercentage), 1),
    [tableData]
  );

  const totals = useMemo(
    () =>
      tableData.reduce(
        (acc, entry) => ({
          allocation: acc.allocation + entry.allocationPercentage,
          lots: acc.lots + entry.lots,
          shares: acc.shares + entry.shares,
          cost: acc.cost + entry.totalCost,
        }),
        { allocation: 0, lots: 0, shares: 0, cost: 0 }
      ),
    [tableData]
  );

  if (tableData.length < 1) {
    return (
      <Card className="border-dashed shadow-none">
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <p className="text-sm">
              Enter valid inputs to generate the allocation plan.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const finalAverage = tableData[tableData.length - 1].averagePurchasePrice;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tableDataToCsv(tableData));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable; the download button still works.
    }
  };

  const handleDownload = () => {
    downloadCsv('allocation-plan.csv', tableDataToCsv(tableData));
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Allocation Plan</CardTitle>
        <div className="flex items-center gap-2 print:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-primary" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
            {copied ? 'Copied' : 'Copy CSV'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            CSV
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="hidden overflow-hidden rounded-md border md:block print:block">
          <Table
            containerClassName="max-h-[65vh] print:max-h-none print:overflow-visible"
            className="border-separate border-spacing-0 [&_td]:border-b [&_th]:border-b"
          >
            <TableCaption className="sr-only">
              Allocation plan per price level, from the highest price down to
              the lowest.
            </TableCaption>
            <TableHeader className="[&_th]:sticky [&_th]:top-0 [&_th]:z-10 [&_th]:bg-background">
              <TableRow>
                <TableHead className="text-right">Price per Share</TableHead>
                <TableHead className="text-right">Capital Allocated</TableHead>
                <TableHead className="text-right">Lots</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
                <TableHead className="text-right">
                  Avg Purchase Price
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((entry, index) => {
                const isLast = index === tableData.length - 1;

                return (
                  <TableRow key={entry.price} className="even:bg-muted/40">
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(entry.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className="h-1.5 w-16 overflow-hidden rounded-full bg-muted"
                          aria-hidden="true"
                        >
                          <span
                            className="block h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
                            style={{
                              width: `${Math.min(
                                (entry.allocationPercentage / maxAllocation) *
                                  100,
                                100
                              )}%`,
                            }}
                          />
                        </span>
                        <span className="tabular-nums">
                          {entry.allocationPercentage.toFixed(2)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(entry.lots)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(entry.shares)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(entry.totalCost)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right tabular-nums',
                        isLast && 'font-semibold text-primary'
                      )}
                    >
                      {entry.lots > 0 ? formatCurrency(entry.averagePurchasePrice) : '—'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter className="[&_td]:border-t">
              <TableRow className="hover:bg-transparent">
                <TableCell>Total</TableCell>
                <TableCell className="text-right tabular-nums">
                  {totals.allocation.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNumber(totals.lots)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNumber(totals.shares)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(totals.cost)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {totals.lots > 0 ? formatCurrency(finalAverage) : '—'}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <div className="space-y-3 md:hidden print:hidden">
          {tableData.map((entry) => (
            <div key={entry.price} className="rounded-lg border p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium tabular-nums">
                  {formatCurrency(entry.price)}
                </span>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {entry.allocationPercentage.toFixed(2)}%
                </span>
              </div>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Lots</dt>
                  <dd className="tabular-nums">{formatNumber(entry.lots)}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Shares</dt>
                  <dd className="tabular-nums">{formatNumber(entry.shares)}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Cost</dt>
                  <dd className="tabular-nums">
                    {formatCurrency(entry.totalCost)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Avg</dt>
                  <dd className="tabular-nums">
                    {entry.lots > 0 ? formatCurrency(entry.averagePurchasePrice) : '—'}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
