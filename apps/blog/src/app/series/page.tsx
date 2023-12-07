import React from 'react';
import { SeriesRepository } from 'src/repository/seriesRepository';
import { SeriesList } from './components/SeriesList';

export const getData = async (seriesId?: number) => {
  const seriesRepository = new SeriesRepository();
  const series = seriesRepository.getSeries();
  const seriesDetail = seriesId ? seriesRepository.getSeriesDetail({ id: seriesId }) : undefined;

  const promiseList = await Promise.all([series, seriesDetail]);

  return { series: promiseList[0], seriesDetail: promiseList[1] || undefined };
};

interface SeriesPageProps {
  searchParams?: {
    seriesId?: number;
  };
}

async function SeriesPage({ searchParams }: SeriesPageProps) {
  const seriesId = searchParams?.seriesId;
  const { series, seriesDetail } = await getData(seriesId);
  return <SeriesList series={series} seriesDetail={seriesDetail} />;
}

export default SeriesPage;
