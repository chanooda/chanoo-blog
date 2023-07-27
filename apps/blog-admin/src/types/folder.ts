export interface Folder {
  child: Folder[];
  id: number;
  name: string;
  parent?: Folder | null;
  parentId?: number | null;
}

export interface AddFolder {
  name: string;
  parentId: number | null;
}
