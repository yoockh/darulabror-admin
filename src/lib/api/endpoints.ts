import { apiFetch } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { API_PATHS } from "@/lib/config";
import type {
  AdminDTO,
  ArticleDTO,
  ArticleStatus,
  ContactDTO,
  ContactStatus,
  Paginated,
  RegistrationDTO,
  RegistrationStatus,
} from "@/lib/types";

function withId(template: string, id: string | number) {
  return template.replace(":id", encodeURIComponent(String(id)));
}

export async function login(email: string, password: string) {
  // backend biasanya mengembalikan token di data.token / data.access_token
  const data = await apiFetch<any>(API_PATHS.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return data as any;
}

export async function getProfile() {
  return apiFetch<AdminDTO>(API_PATHS.profile, { method: "GET" });
}

export async function patchMyPassword(
  current_password: string,
  new_password: string,
) {
  return apiFetch<unknown>(API_PATHS.profilePassword, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ current_password, new_password }),
  });
}

export async function listRegistrations(params: {
  page: number;
  limit: number;
  status?: RegistrationStatus;
}) {
  return apiFetch<Paginated<RegistrationDTO>>(API_PATHS.registrations, {
    method: "GET",
    query: params,
  });
}

export async function getRegistration(id: string | number) {
  return apiFetch<RegistrationDTO>(`${API_PATHS.registrations}/${id}`, { method: "GET" });
}

export async function patchRegistrationStatus(
  id: string | number,
  status: RegistrationStatus,
) {
  return apiFetch<RegistrationDTO>(withId(API_PATHS.registrationStatus, id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export async function listContacts(params: {
  page: number;
  limit: number;
  status?: ContactStatus;
}) {
  return apiFetch<Paginated<ContactDTO>>(API_PATHS.contacts, {
    method: "GET",
    query: params,
  });
}

export async function getContact(id: string | number) {
  return apiFetch<ContactDTO>(`${API_PATHS.contacts}/${id}`, { method: "GET" });
}

export async function patchContactStatus(id: string | number, status: ContactStatus) {
  return apiFetch<ContactDTO>(withId(API_PATHS.contactStatus, id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

// Admins (superadmin only)
export async function listAdmins() {
  return apiFetch<AdminDTO[]>(API_PATHS.admins, { method: "GET" });
}

export async function createAdmin(payload: {
  username: string;
  email: string;
  role: "admin" | "superadmin";
  password: string;
  is_active: boolean;
}) {
  return apiFetch<AdminDTO>(API_PATHS.admins, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateAdmin(
  id: string | number,
  payload: {
    username: string;
    email: string;
    role: "admin" | "superadmin";
    password?: string;
    is_active: boolean;
  },
) {
  return apiFetch<AdminDTO>(withId(API_PATHS.adminEdit, id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteAdmin(id: string | number) {
  return apiFetch<unknown>(withId(API_PATHS.adminEdit, id), { method: "DELETE" });
}

// Articles (basic scaffolding)
export async function listArticles(params: {
  page: number;
  limit: number;
  status?: ArticleStatus;
}) {
  return apiFetch<Paginated<ArticleDTO>>(API_PATHS.articles, { method: "GET", query: params });
}

export async function getArticle(id: string | number) {
  const encoded = encodeURIComponent(String(id));
  const candidates = Array.from(
    new Set([
      // primary (what swagger shows for PUT; some backends also support GET here)
      withId(API_PATHS.articleEdit, id),
      // common alternatives (some APIs separate detail endpoints)
      `${API_PATHS.articles}/${encoded}`,
      `${API_PATHS.articles}/${encoded}/detail`,
      `${API_PATHS.articles}/detail/${encoded}`,
    ]),
  );

  let last404: unknown = null;
  for (const path of candidates) {
    try {
      return await apiFetch<ArticleDTO>(path, { method: "GET" });
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        last404 = e;
        continue;
      }
      throw e;
    }
  }

  throw (last404 as any) ?? new ApiError("Artikel tidak ditemukan.", 404);
}

export async function createArticle(formData: FormData) {
  return apiFetch<ArticleDTO>(API_PATHS.articles, { method: "POST", body: formData });
}

export async function updateArticle(id: string | number, formData: FormData) {
  return apiFetch<ArticleDTO>(withId(API_PATHS.articleEdit, id), {
    method: "PUT",
    body: formData,
  });
}

export async function deleteArticle(id: string | number) {
  return apiFetch<unknown>(withId(API_PATHS.articleEdit, id), { method: "DELETE" });
}
