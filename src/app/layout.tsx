import type { Metadata } from "next";
import { Inter, Poppins, Roboto, Open_Sans, Nunito, Lato, Raleway, Ubuntu } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { CurrencyProvider } from "@/lib/currencyContext";
import { ToastProvider } from "@/lib/toast-context";

// Choose one of these fonts to experiment with:
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
  display: "swap",
});

// Change this line to use a different font:
const currentFont = poppins; // Try: inter, poppins, roboto, openSans, nunito, lato, raleway, ubuntu

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
        className={`${currentFont.variable} font-sans antialiased`}
      >
        <CurrencyProvider>
          <ToastProvider>
            <ScrollToTop />
            <Navbar />
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
