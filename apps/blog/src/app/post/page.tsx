import { getSeries, getTags, getWrites } from "src/base";
import type { WriteReq } from "utils";
import { PostList } from "./components/PostList";

const getData = async (writeReq: WriteReq) => {
	const writes = await getWrites({
		...writeReq,
		isPublish: true,
	});
	const series = await getSeries();
	const tags = await getTags();
	const promiseList = await Promise.all([writes, series, tags]);

	return {
		writes: promiseList[0],
		series: promiseList[1],
		tags: promiseList[2],
	};
};

interface PostPageProps {
	searchParams: {
		search: string;
		seriesId: number;
		tagId: number;
	};
}

async function PostPage({ searchParams }: PostPageProps) {
	const writeReq: WriteReq = {
		search: searchParams?.search || "",
		seriesId: Number(searchParams?.seriesId) || undefined,
		tagId: Number(searchParams?.tagId) || undefined,
	};
	const { series, writes, tags } = await getData(writeReq);

	return <PostList series={series} tags={tags} writes={writes} />;
}

export default PostPage;
