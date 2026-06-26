import { useState, type FormEvent } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import type { Note } from "../../types/note";

const STORAGE_KEY = "devdesk-notes";

function createNote(content: string): Note {
  return {
    id: crypto.randomUUID(),
    content,
    createdAt: new Date().toISOString(),
  };
}

function NotesWidget() {
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEY, []);
  const [noteContent, setNoteContent] = useState("");

  function handleAddNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = noteContent.trim();

    if (!trimmedContent) {
      return;
    }

    setNotes((currentNotes) => [
      createNote(trimmedContent),
      ...currentNotes,
    ]);

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
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== noteId),
    );
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

        <button
          type="submit"
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Add note
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {notes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No notes yet. Capture a thought before it disappears.
          </p>
        ) : (
          notes.map((note) => (
            <article
              key={note.id}
              className="rounded-xl border border-amber-200 bg-amber-50 p-3 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/30"
            >
              <textarea
                value={note.content}
                onChange={(event) =>
                  handleUpdateNote(note.id, event.target.value)
                }
                rows={3}
                className="w-full resize-none bg-transparent text-sm leading-6 text-slate-800 outline-none dark:text-amber-50"
              />

              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-sm font-medium text-rose-600 transition hover:text-rose-700"
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default NotesWidget;