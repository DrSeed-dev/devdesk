import { useRef, useState, type ChangeEvent } from "react";
import { Download, Upload } from "lucide-react";
import {
  MAX_BACKUP_BYTES,
  downloadBackup,
  parseBackup,
  restoreBackup,
  summarizeBackup,
} from "../../lib/backup";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

type PendingRestore = {
  fileName: string;
  summary: string;
  data: Record<string, unknown>;
};

type BackupDialogProps = {
  onClose: () => void;
};

function BackupDialog({ onClose }: BackupDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [pending, setPending] = useState<PendingRestore | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    // Clear the input so choosing the same file again still triggers a change.
    event.target.value = "";

    setErrorMessage("");
    setPending(null);

    if (!file) {
      return;
    }

    if (file.size > MAX_BACKUP_BYTES) {
      setErrorMessage("That file is too large to be a DevDesk backup.");
      return;
    }

    const result = parseBackup(await file.text());

    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }

    setPending({
      fileName: file.name,
      summary: summarizeBackup(result.data),
      data: result.data,
    });
  }

  function handleConfirmRestore() {
    if (!pending) {
      return;
    }

    try {
      restoreBackup(pending.data);
      // Reload so every panel starts fresh from the restored data.
      window.location.reload();
    } catch {
      setErrorMessage("Couldn't save the backup on this device.");
    }
  }

  return (
    <Modal title="Backup and restore" onClose={onClose}>
      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Download a backup
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Saves your tasks, notes, contacts, alarms, city and GitHub username
            to a file on this device. DevDesk keeps everything in this browser
            only, so a backup protects you if you clear your data or switch
            computers.
          </p>
          <Button
            type="button"
            className="mt-3 inline-flex items-center gap-2"
            onClick={downloadBackup}
          >
            <Download size={16} aria-hidden="true" />
            Download backup
          </Button>
        </section>

        <section>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Restore from a backup
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Choose a backup file you downloaded before. Restoring replaces what
            is on this device right now.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="sr-only"
            aria-label="Choose a backup file"
            tabIndex={-1}
          />

          <Button
            type="button"
            variant="ghost"
            className="mt-3 inline-flex items-center gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} aria-hidden="true" />
            Choose backup file
          </Button>

          {errorMessage ? (
            <p
              role="alert"
              className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
            >
              {errorMessage}
            </p>
          ) : null}

          {pending ? (
            <div
              role="status"
              className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
            >
              <p>
                <span className="font-bold">{pending.fileName}</span> contains{" "}
                {pending.summary}. Restoring will replace what is on this device
                now.
              </p>

              <div className="mt-3 flex gap-2">
                <Button type="button" onClick={handleConfirmRestore}>
                  Replace my data
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setPending(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </Modal>
  );
}

export default BackupDialog;