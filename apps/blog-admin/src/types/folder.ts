export interface Folder {
  _count?: {
    folderImage: number;
  };
  child: Folder[];
  folderImage?: FolderImage[];
  id: number;
  name: string;
  parent?: Folder | null;
  parentId?: number | null;
}

export interface AddFolder {
  name: string;
  parentId: number | null;
}

export type EditFolder = Omit<Partial<Folder>, 'id'>;

export interface FolderImage {
  fieldname: string;
  folderId: number;
  id: number;
  mimetype: string;
  originalname: string;
  size: number;
  url: string;
}
