import { useState, type FormEvent } from "react";
import { parseLinkedinUrl } from "../../../lib/linkedin";
import { buildIntroMessage, CONNECTION_NOTE_LIMIT } from "../../../lib/outreach";
import {
  CONTACT_ROLES,
  isContactRole,
  type Contact,
  type ContactRole,
} from "../../../types/contact";
import Button from "../../ui/Button";
import CopyButton from "../../ui/CopyButton";
import { INPUT_CLASS, LABEL_CLASS } from "../../ui/fieldStyles";
import Modal from "../../ui/Modal";
import Select from "../../ui/Select";

type ContactModalProps = {
  contact: Contact;
  onSave: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
  onClose: () => void;
};

const ROLE_OPTIONS = CONTACT_ROLES.map((role) => ({ value: role, label: role }));

function ContactModal({ contact, onSave, onDelete, onClose }: ContactModalProps) {
  const [name, setName] = useState(contact.name);
  const [role, setRole] = useState<ContactRole>(
    isContactRole(contact.role) ? contact.role : "Other",
  );
  const [company, setCompany] = useState(contact.company ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(contact.linkedinUrl);
  const [followUpOn, setFollowUpOn] = useState(contact.followUpOn ?? "");
  const [note, setNote] = useState(contact.note);
  const [errorMessage, setErrorMessage] = useState("");

  const introMessage = buildIntroMessage(role, name);

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage("Add a name.");
      return;
    }

    const linkedin = parseLinkedinUrl(linkedinUrl);

    if (!linkedin.ok) {
      setErrorMessage(linkedin.error);
      return;
    }

    onSave({
      ...contact,
      name: trimmedName,
      role,
      company: company.trim(),
      linkedinUrl: linkedin.url,
      followUpOn,
      note: note.trim(),
    });
    onClose();
  }

  return (
    <Modal title="Contact" onClose={onClose}>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-edit-name" className={LABEL_CLASS}>
              Name
            </label>
            <input
              id="contact-edit-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <span className={LABEL_CLASS}>Role</span>
            <Select
              label="Role"
              value={role}
              options={ROLE_OPTIONS}
              onChange={setRole}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="contact-edit-company" className={LABEL_CLASS}>
              Company
            </label>
            <input
              id="contact-edit-company"
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Optional"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="contact-edit-follow-up" className={LABEL_CLASS}>
              Follow up on
            </label>
            <input
              id="contact-edit-follow-up"
              type="date"
              value={followUpOn}
              onChange={(event) => setFollowUpOn(event.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-edit-linkedin" className={LABEL_CLASS}>
            LinkedIn link
          </label>
          <input
            id="contact-edit-linkedin"
            type="text"
            value={linkedinUrl}
            onChange={(event) => setLinkedinUrl(event.target.value)}
            placeholder="linkedin.com/in/their-name"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="contact-edit-note" className={LABEL_CLASS}>
            Notes
          </label>
          <textarea
            id="contact-edit-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            placeholder="How you met, what to remember, what to ask next"
            className={`${INPUT_CLASS} resize-none`}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Connection message
            </span>
            <span
              className={`text-xs tabular-nums ${
                introMessage.length > CONNECTION_NOTE_LIMIT
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {introMessage.length}/{CONNECTION_NOTE_LIMIT}
            </span>
          </div>
          <textarea
            readOnly
            aria-label="Connection message"
            value={introMessage}
            rows={3}
            className={`${INPUT_CLASS} resize-none bg-slate-50 dark:bg-slate-900`}
          />
          <div className="mt-2">
            <CopyButton text={introMessage} label="Copy message" />
          </div>
        </div>

        {errorMessage ? (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-2 pt-1">
          <Button
            type="button"
            variant="danger"
            className="px-3 py-1.5"
            onClick={() => onDelete(contact.id)}
          >
            Delete contact
          </Button>

          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ContactModal;
