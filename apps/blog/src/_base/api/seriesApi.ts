import type { IdReq, Series, SeriesDetail } from "utils";
import { baseApi } from "./fetch";

export const getSeries = async () => {
	try {
		const series = await baseApi.get<Series[]>("series");
		return series;
	} catch (e) {
		console.error(e);
		throw e;
	}
};

export const getSeriesDetail = async (idReq: IdReq) => {
	try {
		const seriesDetail = await baseApi.get<SeriesDetail>(`/series/${idReq.id}`);
		return seriesDetail;
	} catch (e) {
		console.error(e);
		throw e;
	}
};
