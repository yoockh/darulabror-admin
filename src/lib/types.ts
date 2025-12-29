export type Role = "admin" | "superadmin";

export type AdminDTO = {
  id: string | number;
  username: string;
  email: string;
  role: Role;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type RegistrationStatus = "new" | "validate" | "process" | "done";
export type ContactStatus = "new" | "in_progress" | "done";

// Backend fields bisa lebih banyak; kita simpan minimal + index signature.
export type RegistrationDTO = {
  id: string | number;
  full_name?: string;
  email?: string;
  phone?: string;
  nisn?: string;
  student_type?: string;
  status?: RegistrationStatus;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type ContactDTO = {
  id: string | number;
  email?: string;
  subject?: string;
  message?: string;
  status?: ContactStatus;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type ArticleStatus = "draft" | "published";

export type ArticleDTO = {
  id: string | number;
  title: string;
  author: string;
  status: ArticleStatus;
  photo_header?: string;
  content?: unknown;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type ApiEnvelope<T> = {
  status?: boolean | string | number;
  message?: string;
  data?: T;
};

export type Paginated<T> =
  | { items: T[]; total?: number; page?: number; limit?: number }
  | { data: T[]; total?: number; page?: number; limit?: number }
  | T[];
