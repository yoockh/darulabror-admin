export const APP_NAME = "Darul Abror Admin";

export function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://darulabror-717070183986.asia-southeast2.run.app"
  );
}

export const API_PATHS = {
  login: process.env.API_LOGIN_PATH ?? "/admin/login",
  profile: process.env.API_PROFILE_PATH ?? "/admin/profile",
  profilePassword: process.env.API_PROFILE_PASSWORD_PATH ?? "/admin/profile/password",

  registrations: process.env.API_REGISTRATIONS_PATH ?? "/admin/registrations",
  registrationStatus:
    process.env.API_REGISTRATION_STATUS_PATH ?? "/admin/registrations/:id/status",
  contacts: process.env.API_CONTACTS_PATH ?? "/admin/contacts",
  contactStatus:
    process.env.API_CONTACT_STATUS_PATH ?? "/admin/contacts/:id/status",

  articles: process.env.API_ARTICLES_PATH ?? "/admin/articles",
  articleEdit: process.env.API_ARTICLE_EDIT_PATH ?? "/admin/articles/:id",

  admins: process.env.API_ADMINS_PATH ?? "/admin/admins",
  adminEdit: process.env.API_ADMIN_EDIT_PATH ?? "/admin/admins/:id",
};
