import type { TableEntry } from '@/stores/allocationStore';

const HEADERS = [
  'Price per Share',
  'Capital Allocated (%)',
  'Lots',
  'Shares',
  'Total Cost (IDR)',
  'Avg Purchase Price (IDR)',
];

export function tableDataToCsv(rows: TableEntry[]): string {
  const lines = rows.map((entry) =>
    [
      entry.price,
      entry.allocationPercentage.toFixed(2),
      entry.lots,
      entry.shares,
      entry.totalCost.toFixed(0),
      entry.averagePurchasePrice.toFixed(2),
    ].join(',')
  );

  return [HEADERS.join(','), ...lines].join('\n');
}

export function downloadCsv(filename: string, contents: string) {
  const blob = new Blob([contents], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
