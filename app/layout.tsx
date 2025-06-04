import type { Metadata } from "next";

import LocalFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme/theme-provider";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

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
  title: "Approved 🤌",
  description: "Recommendme - by us at fastfast.computer",
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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              <Toaster duration={6000} position="top-center" richColors closeButton />
              <main>{children}</main>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
