import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EVAL-PEMDI - Portal Evaluasi Kinerja Pemerintah Digital (Permenpan RB 8/2026)",
  description: "Portal Evaluasi Kinerja Pemerintah Digital berdasarkan Permenpan RB Nomor 8 Tahun 2026",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-[#f0f7ff]`}
      style={{ colorScheme: 'light' }}
    >
      <body 
        className="min-h-full flex flex-col bg-[#f0f7ff] text-[#0c2340] antialiased"
        style={{ backgroundColor: '#f0f7ff', color: '#0c2340' }}
      >
        {children}
      </body>
    </html>
  );
}
