import { Analytics } from "@vercel/analytics/react";

import "@/styles/globals.css";

export const metadata = {
  title: "Matching Card Game",
  description: "A Pokémon themed matching card memory game.",
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
