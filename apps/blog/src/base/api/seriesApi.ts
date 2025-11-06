import type { GlobalResponse, IdReq, Series, SeriesDetail } from "utils";
import { baseApi } from "./fetch";

export const getSeries = async () => {
	try {
		const series = await baseApi.get<GlobalResponse<Series[]>>("series");
		return series.data;
	} catch (e) {
		console.error(e);
		return [];
	}
};

export const getSeriesDetail = async (idReq: IdReq) => {
	const seriesDetail = await baseApi.get<GlobalResponse<SeriesDetail>>(
		`/series/${idReq.id}`,
	);
	return seriesDetail.data;
};
