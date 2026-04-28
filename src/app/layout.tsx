import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css"; 
import { Providers } from "@/components/Providers";

import Chatbot from "@/components/dashboard/support/Chatbot";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VibeMarket",
  description: "Tu mercado digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="es">
        <head>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        </head>
        <body className={font.className}>
          {children}
          
          {}
          <Chatbot />
        </body>
      </html>
    </Providers>
  );
}