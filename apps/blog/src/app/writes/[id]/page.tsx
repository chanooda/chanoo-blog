import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { removeMarkdown } from "utils";
import { getWrite } from "@/src/_base/api";
import { WriteDetail } from "@/src/_pages/writes";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	try {
		const { id } = await params;
		const write = await getWrite({ id });

		if (!write) notFound();

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
	const { id } = await params;
	const write = await getWrite({ id });

	if (!write) notFound();

	return <WriteDetail write={write} />;
}
