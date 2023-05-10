import { Analytics } from "@vercel/analytics/react";

import "@/styles/globals.scss";

export const metadata = {
  title: "Marching Card Game",
  description: "Marching card game create by next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
