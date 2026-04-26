export interface UserProfile {
  userId: number;
  username: string;
}

export interface UserMedia {
  id: number;
  fk_users: number;
  image_name: string;
  image_url: string;
  date: string;
  status: number;
}

interface UploadDatabaseRecord {
  id: number;
  fk_users: number;
  image_name: string;
  image_url: string;
  date: string;
  status: number;
}

interface UploadResponseItem {
  fileName: string;
  url: string;
  data: UploadDatabaseRecord;
}

export interface UploadApiResponse {
  message: string;
  uploads: UploadResponseItem[];
}