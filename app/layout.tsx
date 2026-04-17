import type { Metadata } from "next";
import "./globals.css";

import Sidebar from "@/components/Sidebar";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "SIGMA Automate",
  description: "Autonomous operations and workflow orchestration platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased text-primary-navy">
        <Sidebar />
        <main className="ml-64 min-h-screen bg-light-gray">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}
