import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { DevToolsWrapper } from "@/components/layout/DevToolsWrapper";
import { CurrencyProvider } from "@/lib/currencyContext";
import { ToastProvider } from "@/lib/toast-context";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
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
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        <CurrencyProvider>
          <ToastProvider>
            <ScrollToTop />
            <Navbar />
            
            {/* Dev Tools Wrapper - Client Component */}
            <DevToolsWrapper />
            
            <main>
              {children}
            </main>
            <Footer />
            <BottomNav />
          </ToastProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
