import { FolderRes } from './res';

export interface AddFolder {
  name: string;
  parentId: number | null;
}

export type EditFolder = Omit<Partial<FolderRes>, 'id'>;

export interface CreateWriteReq {
  content: string;
  imgUrl: string;
  isPublish: boolean;
  seriesName: string;
  tagNames: string[];
  title: string;
}
