export interface WriteReq {
  isPublish?: boolean;
  limit?: number;
  page?: number;
  search?: string;
  seriesId?: number;
  tagId?: number;
}

export interface Tag {
  id: number;
  name: string;
}

export interface WriteTag {
  id: number;
  tag: Tag;
  tagId: number;
  writeId: number;
}

export interface Write {
  content: string;
  createdAt: string;
  heart: number;
  id: number;
  imgUrl: string;
  isPublish: true;
  seriesId: number;
  title: string;
  updatedAt: string;
  view: number;
}

export interface Series {
  id: number;
  name: string;
  writeOrder: number[];
}

export interface SeriesDetail extends Series {
  writes: Write[];
}

export interface WriteDetail extends Write {
  series: SeriesDetail;
  tags: WriteTag[];
}
