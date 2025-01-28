import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react" // optional
import { SpeedInsights } from "@vercel/speed-insights/next" // optional
import "./globals.css";

export const metadata: Metadata = {
  title: "Quizly",
  description: "Transform your content into engaging quizzes in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" sizes="any" />
      </head>
      <body>
        <Analytics /> {/*optional*/}
        <SpeedInsights /> {/*optional*/}
        {children}
      </body>
    </html>
  );
}
