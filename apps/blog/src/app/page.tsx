import type { WriteReq } from "utils";
import { getSeries, getTags, getWrites } from "../_base/api";
import { WriteListWithFilter } from "../_pages/writes";

export const dynamic = "force-dynamic";

const getData = async (writeReq: WriteReq) => {
	const promiseList = await Promise.all([
		getWrites({
			...writeReq,
			isPublish: true,
		}),
		getSeries(),
		getTags(),
	]);

	return {
		writes: promiseList[0],
		series: promiseList[1],
		tags: promiseList[2],
	};
};

interface PostPageProps {
	searchParams: Promise<{
		search: string;
		seriesId: string;
		tagId: string;
	}>;
}
export default async function Home({ searchParams }: PostPageProps) {
	const search = (await searchParams).search;
	const seriesId = (await searchParams).seriesId;
	const tagId = (await searchParams).tagId;
	const writeReq: WriteReq = {
		search,
		seriesId,
		tagId,
	};
	const { series, writes, tags } = await getData(writeReq);
	return <WriteListWithFilter series={series} tags={tags} writes={writes} />;
}
