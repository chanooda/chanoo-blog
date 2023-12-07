export interface FolderImage {
  fieldname: string;
  folderId: number;
  id: number;
  mimetype: string;
  originalname: string;
  size: number;
  url: string;
}

export interface FolderRes {
  _count?: {
    folderImage: number;
  };
  child: FolderRes[];
  folderImage?: FolderImage[];
  id: number;
  name: string;
  parent?: FolderRes | null;
  parentId?: number | null;
}
