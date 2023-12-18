import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TRPCProvider } from "@/components/trpcProvider";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

import "react-loading-skeleton/dist/skeleton.css"
import 'simplebar-react/dist/simplebar.min.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quillfox",
  description: "Making Your Documents Smarter, Your Work Easier.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <TRPCProvider>
        <body
          className={cn(
            "min-h-screen antialiased grainy font-sans",
            inter.className
          )}
        >
          <Navbar />
          {children}
          <Toaster />
        </body>
      </TRPCProvider>
    </html>
  );
}
