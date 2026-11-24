export const CONTACT_ROLES = [
  "Recruiter",
  "Hiring manager",
  "Mentor",
  "Teammate",
  "Client",
  "Other",
] as const;

export type ContactRole = (typeof CONTACT_ROLES)[number];

export type Contact = {
  id: string;
  name: string;
  linkedinUrl: string;
  role: string;
  note: string;
  company?: string;
  // "YYYY-MM-DD". Empty or missing when there is no follow-up planned.
  followUpOn?: string;
};

export function isContactRole(value: string): value is ContactRole {
  return (CONTACT_ROLES as readonly string[]).includes(value);
}
