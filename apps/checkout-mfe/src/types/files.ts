export interface VideoFile {
  id: string;
  file_name: string;
  original_url: string;
  individual_price: number | null;
  album_id: string;
  created_at: string;
  status: boolean;
}

export interface Album {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  fk_users: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  videos: VideoFile[];
}

export interface UploadItem {
  fileName: string;
  url: string;
  data: VideoFile;
}

export interface UploadFilesResponse {
  message: string;
  album: Album;
  uploads: UploadItem[];
}

/** @deprecated Use VideoFile instead */
export type FileEntity = VideoFile;

/** @deprecated Use Album instead */
export type AlbumSummary = Album;
