import { AppHeader } from '@/components/AppHeader';
import { AllocationForm } from '@/components/AllocationForm';
import { AllocationSummary } from '@/components/AllocationSummary';
import { AllocationTable } from '@/components/AllocationTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StockTradingCalculator() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="container mx-auto max-w-6xl flex-1 px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(320px,360px)_minmax(0,1fr)] print:grid-cols-1">
          <section className="print:hidden lg:sticky lg:top-20 lg:h-fit">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Input Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <AllocationForm />
              </CardContent>
            </Card>
          </section>

          <section className="min-w-0 space-y-6">
            <AllocationSummary />
            <AllocationTable />
          </section>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground print:hidden">
        1 lot = 100 shares &middot; All amounts in IDR &middot; Price levels
        step from High Price down to Low Price.
      </footer>
    </div>
  );
}
