'use client';

import { useAllocationStore } from '@/stores/allocationStore';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

export function AllocationTable() {
  const tableData = useAllocationStore((state) => state.tableData);

  if (tableData.length < 1) {
    return (
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
    );
  }

  return (
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
  );
}
