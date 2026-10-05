import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Stock Trading Allocation Calculator',
  description: 'Calculate the allocation of stocks based on exponential growth',
  keywords: [
    'stock',
    'trading',
    'allocation',
    'calculator',
    'saham',
    'indonesia',
    'alokasi',
    'kalkulator',
    'swing trading',
  ],
  creator: 'oshimayoan',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
