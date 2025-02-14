import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import QueryProvider from "../providers/query-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"],weight:['200','400','600','800'] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
  
      <body className={poppins.className}>
      <QueryProvider>
        <main className=" ">
        {children}
        </main>
      
        <Toaster richColors position="top-center" />
      </QueryProvider>
      </body>
    </html>
  );
}
