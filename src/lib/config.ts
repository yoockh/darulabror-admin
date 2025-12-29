export const APP_NAME = "Darul Abror Admin";

export function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://darulabror-717070183986.asia-southeast2.run.app"
  );
}

export const API_PATHS = {
  authLogin: process.env.API_AUTH_LOGIN_PATH ?? "/admin/auth/login",
  authMe: process.env.API_AUTH_ME_PATH ?? "/admin/auth/me",
  authChangePassword:
    process.env.API_AUTH_CHANGE_PASSWORD_PATH ?? "/admin/auth/change-password",

  registrations: process.env.API_REGISTRATIONS_PATH ?? "/admin/registrations",
  contacts: process.env.API_CONTACTS_PATH ?? "/admin/contacts",

  articles: process.env.API_ARTICLES_PATH ?? "/admin/articles",
  mediaUpload: process.env.API_MEDIA_UPLOAD_PATH ?? "/admin/media",

  admins: process.env.API_ADMINS_PATH ?? "/admin/admins",
};
