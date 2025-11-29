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
    default: "My Portfolio - Software Engineer | Data Analytics & Systems Engineering",
    template: "%s | My Portfolio - Software Engineering"
  },
  description: "Experienced Software Engineer specializing in Full Scale Solutions, system architecture, and data-driven solutions. Expertise in React, Next.js, Django, Python, TypeScript, and modern web technologies. Building scalable, secure, and high-performance applications with clean code and engineering best practices.",
  keywords: [
    "software engineer",
    "software engineering",
    "Backend Developer",
    "system architect",
    "web development",
    "React developer",
    "Next.js developer",
    "Django developer",
    "Python developer",
    "TypeScript developer",
    "backend engineer",
    "frontend engineer",
    "API design",
    "microservices",
    "scalable systems",
    "software architecture",
    "data analytics",
    "PostgreSQL",
    "MySQL",
    "software portfolio"
  ],
  authors: [{ name: "Dilane M." }],
  creator: "Dilane M.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio-mct.netlify.app",
    siteName: "Dilane M. - Software Engineer Portfolio",
    title: "Dilane M. - Software Engineer | Backend Developer & System Architect",
    description: "Experienced Software Engineer specializing in Full Scale Solutions, system architecture, and data-driven solutions.",
    images: [
      {
        url: "/images/og/default.png",
        width: 1200,
        height: 630,
        alt: "Dilane M. - Software Engineer Portfolio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dilane M. - Software Engineer | Backend Developer & System Architect",
    description: "Experienced Software Engineer specializing in Full Scale Solutions, system architecture, and data-driven solutions.",
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
  },
  alternates: {
    canonical: "https://portfolio-mct.netlify.app"
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
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Dilane M.",
    "jobTitle": "Software Engineer",
    "description": "Experienced Software Engineer specializing in Full Scale Solutions, system architecture, and data-driven solutions.",
    "url": "https://portfolio-mct.netlify.app",
    "sameAs": [
      // Add your social media profiles here
      // "https://linkedin.com/in/yourprofile",
      // "https://github.com/yourprofile",
      // "https://twitter.com/yourprofile"
    ],
    "knowsAbout": [
      "Software Engineering",
      "Full Scale Solutions",
      "System Architecture",
      "React",
      "Next.js",
      "Django",
      "Python",
      "TypeScript",
      "JavaScript",
      "PostgreSQL",
      "MySQL",
      "API Design",
      "Microservices",
      "Data Analytics"
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Information Systems"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
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
