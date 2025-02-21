import { atom } from "jotai";
import { Note } from "../domain/note";
import { Id } from "../../convex/_generated/dataModel";

export const notesAtom = atom<Note[]>([]);
export const selectedNoteIdAtom = atom<Id<"notes"> | null>(null);

export const selectedNoteAtom = atom((get) => {
  const notes = get(notesAtom);
  const id = get(selectedNoteIdAtom);
  if (id === null) return null;

  return notes.find((note) => note.id === id) || null;
});

export const saveNoteAtom = atom(null, (get, set, newContent: string) => {
  const note = get(selectedNoteAtom);
  if (!note) return;

  const updatedNote = new Note(note.id, note.title, newContent, Date.now());
  const notes = get(notesAtom);
  const updatedNotes = notes.map((n) => {
    if (n.id !== note.id) return n;
    return updatedNote;
  });

  set(notesAtom, updatedNotes);
});