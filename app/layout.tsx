import type { Metadata } from "next";
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
        {children}
      </body>
    </html>
  );
}
