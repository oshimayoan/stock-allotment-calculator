import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AllocationForm } from '@/components/AllocationForm';
import { AllocationSummary } from '@/components/AllocationSummary';
import { AllocationTable } from '@/components/AllocationTable';

export default function StockTradingCalculator() {
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
          <AllocationForm />
        </CardContent>
      </Card>

      <AllocationSummary />

      <AllocationTable />
    </div>
  );
}
