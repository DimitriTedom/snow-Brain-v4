import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import UserManager from "@/components/UserManager";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnowBrain v4",
  description: "Real-time AI Teaching Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{variables: {colorPrimary: '#8b5cf6'}}}>
      <html lang="en">
        <body className={`${bricolage.variable} antialiased flex flex-col min-h-screen`}>
          <NavBar/>
          <UserManager />
          <div className="grow">
            {children}
          </div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
