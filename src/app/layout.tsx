import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { CurrencyProvider } from "@/lib/currencyContext";


const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShoreAgents - Professional Offshore Solutions",
  description: "Leading provider of offshore talent solutions and business process outsourcing services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} font-montserrat antialiased`}
      >
        <CurrencyProvider>
          <Navbar />
          <main>
            {children}
          </main>
        </CurrencyProvider>
      </body>
    </html>
  );
}
