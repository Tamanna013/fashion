import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../app/theme-provider";
import { Navbar } from "../app/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StyleScan - Your AI Wardrobe Assistant",
  description: "Get personalized outfit recommendations based on your wardrobe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ThemeProvider must wrap children */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Add Navbar if it's part of the layout */}
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
