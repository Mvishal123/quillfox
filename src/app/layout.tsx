import Navbar from "@/components/Navbar";
import { TRPCProvider } from "@/components/trpcProvider";
import { Toaster } from "@/components/ui/toaster";
import { cn, generateMetaData } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {...generateMetaData(), icons: "/favicons.ico"};

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
