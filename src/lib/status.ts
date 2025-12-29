export type RegistrationStatus = "new" | "validate" | "process" | "done";
export type ContactStatus = "new" | "in_progress" | "done";
export type ArticleStatus = "draft" | "published";

export function registrationStatusLabel(status: string) {
  switch (status) {
    case "new":
      return "Baru";
    case "validate":
      return "Sedang divalidasi";
    case "process":
      return "Sedang diproses";
    case "done":
      return "Selesai";
    default:
      return status || "-";
  }
}

export function contactStatusLabel(status: string) {
  switch (status) {
    case "new":
      return "Baru";
    case "in_progress":
      return "Sedang diproses";
    case "done":
      return "Selesai";
    default:
      return status || "-";
  }
}

export function articleStatusLabel(status: string) {
  switch (status) {
    case "draft":
      return "Draf";
    case "published":
      return "Terbit";
    default:
      return status || "-";
  }
}
