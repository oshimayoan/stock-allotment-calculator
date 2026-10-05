import { TrendingUp } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
      <div className="container mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-sm font-semibold leading-tight sm:text-base">
              Stock Trading Allocation Calculator
            </h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Exponential scale-in planner &middot; 1 lot = 100 shares &middot;
              IDR
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
