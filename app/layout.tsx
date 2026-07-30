import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider, SonnerProvider, ThemeProvider } from "@/providers";

const manropeHeading = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "RentNest",
  description: "Rental Property Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        inter.variable,
        manropeHeading.variable,
      )}
    >
      <body>
        <ThemeProvider>
          <QueryProvider>
            {children}
            <SonnerProvider />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
