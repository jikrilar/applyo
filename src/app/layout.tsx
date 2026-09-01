import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const body = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Applyo | Kariermu terus maju",
  description:
    "Pantau lamaran, langkah berikutnya, dan setiap tahap pencarian kerja dalam satu ruang kerja yang ramah.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var saved=localStorage.getItem('applyo-theme');var theme=saved==='light'||saved==='dark'?saved:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme}catch(e){document.documentElement.dataset.theme='light'}})()`,
          }}
        />
      </head>
      <body className={`${display.variable} ${body.variable}`}><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
