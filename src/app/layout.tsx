import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingCVButton from "@/components/FloatingCVButton";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio | Software Developer",
    template: "%s | Portfolio"
  },
  description: "Full-stack software developer specializing in modern web technologies. Explore my projects, experience, and technical expertise.",
  keywords: ["software developer", "web development", "full-stack", "portfolio", "react", "next.js", "django", "python", "typescript"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio-mct.netlify.app",
    siteName: "Portfolio",
    title: "Portfolio | Software Developer",
    description: "Full-stack software developer specializing in modern web technologies.",
    images: [
      {
        url: "/images/og/default.png",
        width: 1200,
        height: 630,
        alt: "Portfolio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Software Developer",
    description: "Full-stack software developer specializing in modern web technologies.",
    images: ["/images/og/default.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#00ff9d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <FloatingCVButton />
        </AuthProvider>
      </body>
    </html>
  );
}
