import type { Metadata } from "next";

import LocalFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme/theme-provider";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { RoleProvider } from "@/hooks/use-role";
import Footer from "@/components/nav/footer";

const sans = LocalFont({
  variable: "--font-sans",
  src: [
    {
      path: 'fonts/bold.woff2',
      weight: '700',
    },
    {
      path: 'fonts/medium.woff2',
      weight: '500',
    },
    {
      path: 'fonts/regular.woff2',
      weight: '400',
    },
  ]
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
          className={`${sans.variable} ${geistMono.variable} antialiased`}
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
