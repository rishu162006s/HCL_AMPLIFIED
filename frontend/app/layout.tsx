import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pathwise — Learn with direction",
  description:
    "An AI-powered personalized learning platform that turns your goals into an adaptive learning journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}