import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "../app/theme-provider";
import { AuthProvider } from "../app/components/ui/auth-provider";
import { Navbar } from '../app/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StyleScan - Your AI Wardrobe Assistant',
  description: 'Get personalized outfit recommendations based on your wardrobe',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}