import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'MedAssist Global - Trusted Medical Assistance for Travelers',
  description:
    'Find quality healthcare wherever you are. MedAssist Global connects travelers with trusted hospitals, doctors, and emergency services worldwide.',
  keywords: 'medical assistance, travel healthcare, emergency medical, hospital finder, tourist medical',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                background: '#fff',
                color: '#1f2937',
                fontSize: '14px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
