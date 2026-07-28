import { useState, type FormEvent } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useToast } from "../../context/ToastContext";
import { formatRelativeTime } from "../../lib/formatRelativeTime";
import type { Note } from "../../types/note";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { STORAGE_KEYS } from "../../lib/storageKeys";

function createNote(content: string): Note {
  return {
    id: crypto.randomUUID(),
    content,
    createdAt: new Date().toISOString(),
  };
}

function NotesWidget() {
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEYS.notes, []);
  const [noteContent, setNoteContent] = useState("");
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);
  const { showUndoToast } = useToast();

  const openNote = notes.find((note) => note.id === openNoteId) ?? null;

  function handleAddNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = noteContent.trim();

    if (!trimmedContent) {
      return;
    }

    setNotes((currentNotes) => [createNote(trimmedContent), ...currentNotes]);
    setNoteContent("");
  }

  function handleUpdateNote(noteId: string, nextContent: string) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === noteId ? { ...note, content: nextContent } : note,
      ),
    );
  }

  function handleDeleteNote(noteId: string) {
    const deletedNote = notes.find((note) => note.id === noteId);

    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== noteId),
    );
    setOpenNoteId(null);

    if (deletedNote) {
      showUndoToast("Note deleted", () => {
        setNotes((currentNotes) => [deletedNote, ...currentNotes]);
      });
    }
  }

  return (
    <div>
      <form onSubmit={handleAddNote} className="space-y-3">
        <textarea
          value={noteContent}
          onChange={(event) => setNoteContent(event.target.value)}
          placeholder="Write a quick note..."
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-950"
        />
        <Button type="submit">Add note</Button>
      </form>

      <div className="thin-scrollbar mt-4 max-h-[280px] space-y-2 overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No notes yet. Capture a thought before it disappears.
          </p>
        ) : (
          notes.map((note) => (
            <button
              key={note.id}
              type="button"
              onClick={() => setOpenNoteId(note.id)}
              className="block w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-left transition hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:border-amber-900/60 dark:bg-amber-950/30 dark:focus:ring-offset-slate-900"
            >
              <p className="truncate text-sm text-slate-800 dark:text-amber-50">
                {note.content || "(empty note)"}
              </p>
              <p className="mt-0.5 text-xs text-amber-700/70 dark:text-amber-400/60">
                {formatRelativeTime(note.createdAt)}
              </p>
            </button>
          ))
        )}
      </div>

      {openNote ? (
        <Modal title="Note" onClose={() => setOpenNoteId(null)}>
          <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
            {formatRelativeTime(openNote.createdAt)}
          </p>

          <textarea
            value={openNote.content}
            onChange={(event) =>
              handleUpdateNote(openNote.id, event.target.value)
            }
            rows={8}
            autoFocus
            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-950"
          />

          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="danger"
              onClick={() => handleDeleteNote(openNote.id)}
              className="px-3 py-1.5"
            >
              Delete note
            </Button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

export default NotesWidget;
