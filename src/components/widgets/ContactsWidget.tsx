import { useState, type FormEvent } from "react";
import { ExternalLink } from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useToast } from "../../context/ToastContext";
import { STORAGE_KEYS } from "../../lib/storageKeys";
import type { Contact } from "../../types/contact";
import Button from "../ui/Button";

const ROLE_OPTIONS = ["Recruiter", "Mentor", "Teammate", "Other"] as const;

function createContact(
  name: string,
  linkedinUrl: string,
  role: string,
): Contact {
  return { id: crypto.randomUUID(), name, linkedinUrl, role, note: "" };
}

function normalizeUrl(url: string) {
  if (!url) return url;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function ContactsWidget() {
  const [contacts, setContacts] = useLocalStorage<Contact[]>(
    STORAGE_KEYS.contacts,
    [],
  );
  const [name, setName] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [role, setRole] = useState<(typeof ROLE_OPTIONS)[number]>(
    ROLE_OPTIONS[0],
  );
  const { showUndoToast } = useToast();

  function handleAddContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) return;

    setContacts((current) => [
      createContact(trimmedName, normalizeUrl(linkedinUrl.trim()), role),
      ...current,
    ]);
    setName("");
    setLinkedinUrl("");
  }

  function handleDeleteContact(contactId: string) {
    const deleted = contacts.find((contact) => contact.id === contactId);

    setContacts((current) =>
      current.filter((contact) => contact.id !== contactId),
    );

    if (deleted) {
      showUndoToast("Contact deleted", () => {
        setContacts((current) => [deleted, ...current]);
      });
    }
  }

  return (
    <div>
      <form onSubmit={handleAddContact} className="space-y-2">
        <div className="flex gap-2">
          <label htmlFor="contact-name" className="sr-only">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-950"
          />

          <label htmlFor="contact-role" className="sr-only">
            Role
          </label>
          <select
            id="contact-role"
            value={role}
            onChange={(event) =>
              setRole(event.target.value as (typeof ROLE_OPTIONS)[number])
            }
            className="rounded-xl border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <label htmlFor="contact-linkedin" className="sr-only">
            LinkedIn URL
          </label>
          <input
            id="contact-linkedin"
            type="text"
            value={linkedinUrl}
            onChange={(event) => setLinkedinUrl(event.target.value)}
            placeholder="LinkedIn URL (optional)"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-950"
          />

          <Button type="submit">Add</Button>
        </div>
      </form>

      <div className="thin-scrollbar mt-4 max-h-[280px] space-y-2 overflow-y-auto pr-1">
        {contacts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No contacts yet. Save people worth remembering.
          </p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {contact.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {contact.role}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {contact.linkedinUrl ? (
                  <a
                    href={contact.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${contact.name}'s LinkedIn profile`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-sky-600 transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:text-sky-400 dark:hover:bg-sky-950 dark:focus:ring-offset-slate-950"
                  >
                    <ExternalLink size={16} />
                  </a>
                ) : null}

                <Button
                  type="button"
                  variant="danger"
                  className="px-2 py-1"
                  aria-label={`Delete contact ${contact.name}`}
                  onClick={() => handleDeleteContact(contact.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ContactsWidget;
