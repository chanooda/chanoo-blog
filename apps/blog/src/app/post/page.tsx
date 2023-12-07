import React from 'react';
import { WriteRepository } from 'src/repository/writeRepository';
import { SeriesRepository } from 'src/repository/seriesRepository';
import { TagRepository } from 'src/repository/tagRepository';
import { WriteReq } from 'utils';
import { PostList } from './components/PostList';

const getData = async (writeReq: WriteReq) => {
  const writeRepository = new WriteRepository();
  const seriesRepository = new SeriesRepository();
  const tagRepository = new TagRepository();

  const writes = writeRepository.getWrites({
    ...writeReq,
    isPublish: true
  });
  const series = seriesRepository.getSeries();
  const tags = tagRepository.getTags();
  const promiseList = await Promise.all([writes, series, tags]);

  return { writes: promiseList[0], series: promiseList[1], tags: promiseList[2] };
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
    search: searchParams?.search || '',
    seriesId: Number(searchParams?.seriesId) || 0,
    tagId: Number(searchParams?.tagId) || 0
  };
  const { series, writes, tags } = await getData(writeReq);
  return <PostList series={series} tags={tags} writes={writes} />;
}

export default PostPage;
