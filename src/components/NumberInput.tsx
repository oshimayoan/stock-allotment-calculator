'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const groupFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 0,
});

export type NumberInputProps = Omit<
  React.ComponentProps<'input'>,
  'value' | 'onChange' | 'type'
> & {
  value: number | null | undefined;
  onValueChange: (value: number | undefined) => void;
  invalid?: boolean;
  prefix?: string;
};

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    { className, value, onValueChange, invalid, prefix, onBlur, ...props },
    ref
  ) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null);
    const caretDigits = React.useRef<number | null>(null);

    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    const displayValue =
      typeof value === 'number' && Number.isFinite(value)
        ? groupFormatter.format(value)
        : '';

    React.useEffect(() => {
      if (caretDigits.current === null || !innerRef.current) {
        return;
      }

      const digitsBeforeCaret = caretDigits.current;
      caretDigits.current = null;

      let position = 0;
      let seenDigits = 0;
      while (position < displayValue.length && seenDigits < digitsBeforeCaret) {
        if (/\d/.test(displayValue[position])) {
          seenDigits += 1;
        }
        position += 1;
      }

      innerRef.current.setSelectionRange(position, position);
    }, [displayValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      const selectionStart = event.target.selectionStart ?? raw.length;

      caretDigits.current = raw
        .slice(0, selectionStart)
        .replace(/\D/g, '').length;

      const digits = raw.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
      onValueChange(digits === '' ? undefined : Number(digits));
    };

    return (
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex select-none items-center text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          ref={innerRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={displayValue}
          onChange={handleChange}
          onBlur={onBlur}
          aria-invalid={invalid || undefined}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            prefix && 'pl-10',
            invalid && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
