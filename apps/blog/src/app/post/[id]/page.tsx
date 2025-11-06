import type { Metadata } from "next";
import { getWrite } from "src/base";
import { removeMarkdown } from "utils";
import { PostDetail } from "../components/PostDetail";

interface PageProps {
	params: {
		id: string;
	};
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	try {
		const write = await getWrite({ id: params.id });

		return {
			title: `${write.title} | chanoo`,
			description: removeMarkdown(write.content),
			openGraph: {
				title: write.title,
				images: [write.imgUrl || ""],
				description: removeMarkdown(write.content),
			},
		};
	} catch (error: unknown) {
		console.error(error);
		throw error;
	}
}

export default async function Page({ params }: PageProps) {
	const write = await getWrite({ id: params.id });

	return <PostDetail write={write} />;
}
