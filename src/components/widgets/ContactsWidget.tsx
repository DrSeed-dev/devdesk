import { useMemo, useState, type FormEvent } from "react";
import { ExternalLink } from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useNow } from "../../hooks/useNow";
import { useToast } from "../../hooks/useToast";
import {
  avatarColorIndex,
  filterContacts,
  getInitials,
  sortContacts,
} from "../../lib/contacts";
import { getFollowUpStatus, toDateKey, type FollowUpTone } from "../../lib/followUp";
import { parseLinkedinUrl } from "../../lib/linkedin";
import { STORAGE_KEYS } from "../../lib/storageKeys";
import { CONTACT_ROLES, type Contact, type ContactRole } from "../../types/contact";
import Button from "../ui/Button";
import { INPUT_CLASS } from "../ui/fieldStyles";
import Select from "../ui/Select";
import ContactModal from "./contacts/ContactModal";

const ROLE_OPTIONS = CONTACT_ROLES.map((role) => ({ value: role, label: role }));

// Written out in full so Tailwind can see every class.
const AVATAR_COLORS = [
  "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
];

const FOLLOW_UP_STYLES: Record<FollowUpTone, string> = {
  overdue: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  today: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  soon: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  later: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const SEARCH_AFTER_COUNT = 5;

function ContactsWidget() {
  const [contacts, setContacts] = useLocalStorage<Contact[]>(
    STORAGE_KEYS.contacts,
    [],
  );
  const [name, setName] = useState("");
  const [role, setRole] = useState<ContactRole>("Recruiter");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const [openContactId, setOpenContactId] = useState<string | null>(null);
  const { showUndoToast } = useToast();

  const now = useNow(60_000);
  const todayKey = toDateKey(now);

  const visibleContacts = useMemo(
    () => sortContacts(filterContacts(contacts, query), todayKey),
    [contacts, query, todayKey],
  );

  const openContact = contacts.find((contact) => contact.id === openContactId) ?? null;

  function handleAddContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const linkedin = parseLinkedinUrl(linkedinUrl);

    if (!linkedin.ok) {
      setErrorMessage(linkedin.error);
      return;
    }

    setContacts((current) => [
      {
        id: crypto.randomUUID(),
        name: trimmedName,
        role,
        linkedinUrl: linkedin.url,
        note: "",
        company: "",
        followUpOn: "",
      },
      ...current,
    ]);
    setName("");
    setLinkedinUrl("");
    setErrorMessage("");
  }

  function handleSaveContact(updated: Contact) {
    setContacts((current) =>
      current.map((contact) => (contact.id === updated.id ? updated : contact)),
    );
  }

  function handleDeleteContact(contactId: string) {
    const deleted = contacts.find((contact) => contact.id === contactId);

    setContacts((current) =>
      current.filter((contact) => contact.id !== contactId),
    );
    setOpenContactId(null);

    if (deleted) {
      showUndoToast("Contact deleted", () => {
        setContacts((current) => [deleted, ...current]);
      });
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
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
            className={`min-w-0 flex-1 ${INPUT_CLASS}`}
          />

          <Select
            label="Role"
            value={role}
            options={ROLE_OPTIONS}
            onChange={setRole}
            className="w-36 shrink-0"
          />
        </div>

        <div className="flex gap-2">
          <label htmlFor="contact-linkedin" className="sr-only">
            LinkedIn link
          </label>
          <input
            id="contact-linkedin"
            type="text"
            value={linkedinUrl}
            onChange={(event) => {
              setLinkedinUrl(event.target.value);
              setErrorMessage("");
            }}
            placeholder="LinkedIn link (optional)"
            className={`min-w-0 flex-1 ${INPUT_CLASS}`}
          />

          <Button type="submit">Add</Button>
        </div>

        {errorMessage ? (
          <p role="alert" className="text-xs text-rose-600 dark:text-rose-400">
            {errorMessage}
          </p>
        ) : null}
      </form>

      {contacts.length >= SEARCH_AFTER_COUNT ? (
        <div className="mt-3">
          <label htmlFor="contact-search" className="sr-only">
            Search people
          </label>
          <input
            id="contact-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search people"
            className={INPUT_CLASS}
          />
        </div>
      ) : null}

      <div className="thin-scrollbar mt-3 max-h-72 min-h-0 space-y-2 overflow-y-auto pr-1 lg:max-h-none lg:flex-1">
        {contacts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No contacts yet. Save people worth remembering.
          </p>
        ) : visibleContacts.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
            Nobody matches that search.
          </p>
        ) : (
          visibleContacts.map((contact) => {
            const status = getFollowUpStatus(contact.followUpOn, now);
            const subtitle = [contact.role, contact.company]
              .filter(Boolean)
              .join(" · ");

            return (
              <div
                key={contact.id}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 pr-2 dark:border-slate-800 dark:bg-slate-950"
              >
                <button
                  type="button"
                  onClick={() => setOpenContactId(contact.id)}
                  aria-label={`Open ${contact.name}`}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      AVATAR_COLORS[avatarColorIndex(contact.name)]
                    }`}
                  >
                    {getInitials(contact.name)}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                      {contact.name}
                    </span>
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                      {subtitle}
                    </span>
                  </span>

                  {status ? (
                    <span
                      className={`shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
                        FOLLOW_UP_STYLES[status.tone]
                      }`}
                    >
                      {status.label}
                    </span>
                  ) : null}
                </button>

                {contact.linkedinUrl ? (
                  <a
                    href={contact.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${contact.name}'s LinkedIn profile`}
                    title="Open LinkedIn profile"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sky-600 transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-sky-400 dark:hover:bg-sky-950"
                  >
                    <ExternalLink size={16} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      {openContact ? (
        <ContactModal
          key={openContact.id}
          contact={openContact}
          onSave={handleSaveContact}
          onDelete={handleDeleteContact}
          onClose={() => setOpenContactId(null)}
        />
      ) : null}
    </div>
  );
}

export default ContactsWidget;
