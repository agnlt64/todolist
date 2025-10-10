import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ma todo list",
  description: "Une app de todo list simple et efficace",
};

import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

type RootLayoutProps = Readonly<{ 
  children: React.ReactNode; 
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="container mx-auto p-4">
          <Navbar />
          <div className="ml-[250px]">
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </div>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
