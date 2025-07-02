import type { Metadata } from "next";

import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme/theme-provider";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { RoleProvider } from "@/hooks/use-role";
import Footer from "@/components/nav/footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GetReferenced",
  description: "GetReferenced - by us at fastfast.computer",
  icons: {
    icon: "/convex.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${geistMono.variable} antialiased`}
        >
          <SpeedInsights />
          <Analytics />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <ConvexClientProvider>
          <RoleProvider>
            <Toaster
              position="top-center"
              richColors
            />
            <main className="min-h-dvh">{children}</main>
            <Footer />
          </RoleProvider>
          </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
