import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ascalon",
  description: "Track the words you write each day.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head><meta name="ascalon-version" content={process.env.NEXT_PUBLIC_COMMIT_SHA ?? "dev"} /></head>
      <body>{children}</body>
    </html>
  );
}
