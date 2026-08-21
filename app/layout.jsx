import './globals.css';
import AuthInitializer from '@/components/auth/AuthInitializer';
import MainLayout from '@/components/layout/MainLayout';

export const metadata = {
  title: 'E-commerce',
  description: 'E-commerce application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthInitializer />
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
