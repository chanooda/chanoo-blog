export interface WritingForm {
  isPublish: boolean;
  mainImage: string;
  series: string;
  tag: string[];
  title: string;
}

export interface WriteFilterForm {
  search: string;
  seriesId: number;
  tagId: number;
}
