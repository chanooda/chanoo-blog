import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { QueryProvider } from "./(provider)/QueryProvider";
import "@ui/styles/globals.css";
import { Layout } from "../_base/ui/client";
import { ThemeProvider } from "./(provider)/ThemeProvider";

const inter = Noto_Sans_KR({
  weight: "400",
  preload: true,
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chanoo Blog",
  description: "개발자 김찬우의 블로그입니다.",
  keywords:
    "김찬우 블로그 개발자 개발자김찬우 김찬우개발자 개발자김찬우블로그 개발블로그 김찬우개발블로그 김찬우블로그",
  authors: { name: "김찬우" },
  openGraph: {
    siteName: "김찬우 블로그",
    type: "website",
    title: "김찬우 블로그",
    description: "개발자 김찬우의 블로그입니다.",
    url: "https://www.blog.chanoo.org",
    images: {
      url: "https://chanoo-image.s3.ap-northeast-2.amazonaws.com/logo/chanoo",
      alt: "김찬우 블로그입니다.",
    },
  },
  twitter: {
    images: {
      url: "https://chanoo-image.s3.ap-northeast-2.amazonaws.com/logo/chanoo",
      alt: "김찬우 블로그입니다.",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Layout>{children}</Layout>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
