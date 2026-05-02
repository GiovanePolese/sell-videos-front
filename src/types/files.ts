export interface FileEntity {
  id: number;
  fk_users: number;
  image_name: string;
  image_url: string;
  album: string;
  date: string;
  status: boolean;
}

export interface UploadItem {
  fileName: string;
  url: string;
  data: FileEntity;
}

export type GetActiveFilesResponse = FileEntity[];

export interface UploadFilesResponse {
  message: string;
  uploads: UploadItem[];
}

export interface AlbumSummary {
  album: string;
  count: number;
  latestDate: string;
}