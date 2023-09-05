export interface SeriesRes {
  id: number;
  name: string;
}

export interface TagRes {
  id: number;
  name: string;
}

export interface WriteTagRes {
  id: number;
  tag: TagRes;
  tagId: number;
  writeId: number;
}

export interface WriteRes {
  content: string;
  createdAt: string;
  heart: number;
  id: number;
  imgUrl: string;
  isPublish: true;
  series: {
    id: number;
    name: string;
  };
  seriesId: number;
  tags: WriteTagRes[];
  title: string;
  updatedAt: string;
  view: number;
}
