import type { MetadataRoute } from "next";
import { getSeries, getTags, getWrites } from "src/base";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const series = await getSeries();
	const tags = await getTags();
	const writes = await getWrites({
		isPublish: true,
	});

	return [
		{
			url: "https://blog.chanoo.org",
			lastModified: new Date(),
		},
		{
			url: "https://blog.chanoo.org/post",
			lastModified: new Date(),
		},
		{
			url: "https://blog.chanoo.org/series",
			lastModified: new Date(),
		},
		...series.map((series) => ({
			url: `https://blog.chanoo.org/series/${series.id}`,
			lastModified: new Date(),
		})),
		...tags.map((tag) => ({
			url: `https://blog.chanoo.org/tag/${tag.id}`,
			lastModified: new Date(),
		})),
		...writes.map((write) => ({
			url: `https://blog.chanoo.org/post/${write.id}`,
			lastModified: write.updatedAt,
		})),
	];
}
