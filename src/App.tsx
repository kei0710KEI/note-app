import { useSetAtom } from "jotai";
import { notesAtom } from "./store";
import { Note } from "./domain/note";
import { useEffect } from "react";
import SideMenu from "./components/SideMenu";
import Editor from "./components/Editor";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const setNotes = useSetAtom(notesAtom);
  const initializeNotes = useQuery(api.notes.get);

  useEffect(() => {
    const notes = initializeNotes?.map(
      (note) => new Note(note._id, note.title, note.content, note.lastEditTime)
    );

    setNotes(notes || []);
  }, [initializeNotes, setNotes]);

  return (
    <>
      <div className="flex h-screen w-full bg-white">
        <SideMenu />
        <Editor />
      </div>
    </>
  );
}

export default App;
