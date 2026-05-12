import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Restaurant Builder - Launch a beautiful site in minutes",
  description:
    "An opinionated, AI-assisted website builder for restaurants. Edit on the left, see your site on the right.",
  openGraph: {
    title: "Restaurant Builder",
    description: "Launch a beautiful restaurant website in minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
