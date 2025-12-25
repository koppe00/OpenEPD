import './globals.css';
import { Inter } from 'next/font/google';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'OpenEPD Beheerportaal',
  description: 'Configuratie en Governance voor OpenEPD',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* Voeg suppressHydrationWarning toe aan de html tag */
    <html lang="nl" suppressHydrationWarning>
      <body className={`${inter.className} flex h-screen overflow-hidden bg-slate-50`}>
        <AdminSidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto pb-20">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}