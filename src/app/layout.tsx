
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./assets/css/globals.css";
import { QClientProvider } from "./provider/QClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Exam GitHub User",
  description: "Otro exámen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QClientProvider>
      <html lang="es-CL">
        <body className={inter.className + ' bg-slate-200'}>{children}</body>
      </html>
    </QClientProvider>
  );
}
