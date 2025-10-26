import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import UserManager from "@/components/UserManager";
import { ClerkProvider } from "@clerk/nextjs";

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
    <ClerkProvider appearance={{variables: {colorPrimary: '#fe5933'}}}>
      <html lang="en">
        <NavBar/>
        <body className={`${bricolage.variable} antialiased`}>
          <UserManager />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
