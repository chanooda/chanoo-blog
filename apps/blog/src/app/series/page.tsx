import { getSeries, getSeriesDetail } from "src/base";
import { SeriesList } from "./components/SeriesList";

const getData = async (seriesId?: string) => {
	const series = getSeries();
	const seriesDetail = seriesId ? getSeriesDetail({ id: seriesId }) : undefined;

	const promiseList = await Promise.all([series, seriesDetail]);

	return { series: promiseList[0], seriesDetail: promiseList[1] || undefined };
};

interface SeriesPageProps {
	searchParams?: {
		seriesId?: string;
	};
}

async function SeriesPage({ searchParams }: SeriesPageProps) {
	const seriesId = searchParams?.seriesId;
	const { series, seriesDetail } = await getData(seriesId);
	return <SeriesList series={series} seriesDetail={seriesDetail} />;
}

export default SeriesPage;
