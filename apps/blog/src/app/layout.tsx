import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Layout } from "../_base/ui/client/layout";
import { QueryProvider } from "../_base/ui/client/QueryProvider";
import "@ui/styles/globals.css";

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
		<html lang="ko">
			<body className={inter.className}>
				<QueryProvider>
					<Layout>{children}</Layout>
				</QueryProvider>
			</body>
		</html>
	);
}
