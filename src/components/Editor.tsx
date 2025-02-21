import { useAtomValue, useSetAtom } from "jotai";
import { saveNoteAtom, selectedNoteAtom } from "../store";
import "@mdxeditor/editor/style.css";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  type MDXEditorMethods,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  ListsToggle,
  codeBlockPlugin,
  codeMirrorPlugin,
  InsertCodeBlock,
} from "@mdxeditor/editor";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

const plugins = [
  headingsPlugin(),

  listsPlugin(),
  markdownShortcutPlugin(),
  codeBlockPlugin({
    defaultCodeBlockLanguage: "js",
  }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      js: "JavaScript",
      jsx: "JavaScript JSX",
      ts: "TypeScript",
      tsx: "TypeScript JSX",
      python: "Python",
      css: "CSS",
      html: "HTML",
      json: "JSON",
    },
  }),
  toolbarPlugin({
    toolbarContents: () => (
      <>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <BoldItalicUnderlineToggles />
          </div>
          <div className="flex gap-1">
            <ListsToggle />
          </div>
          <InsertCodeBlock />
        </div>
      </>
    ),
  }),
];

export const Editor = () => {
  const selectedNote = useAtomValue(selectedNoteAtom);
  const saveNote = useSetAtom(saveNoteAtom);
  const updateNote = useMutation(api.notes.updateNote);
  const editorRef = useRef<MDXEditorMethods>(null);
  const [content, setContent] = useState("");

  const debouncedContent = useDebounce(content, 1000);

  useEffect(() => {
    if (!selectedNote || !debouncedContent) return;
    updateNote({
      noteId: selectedNote.id,
      content: debouncedContent,
      title: selectedNote.title,
    });
  }, [debouncedContent, selectedNote, updateNote]);

  const handleSaving = useCallback(
    (newContent: string) => {
      if (!selectedNote) return;
      saveNote(newContent);
      setContent(newContent);
    },
    [selectedNote, saveNote]
  );

  const handleContentChange = useCallback(
    (content: string) => {
      handleSaving(content);
    },
    [handleSaving]
  );

  return (
    <div className="flex-1">
      {selectedNote ? (
        <MDXEditor
          ref={editorRef}
          key={selectedNote.id}
          markdown={selectedNote.content}
          onChange={handleContentChange}
          plugins={plugins}
          contentEditableClassName="prose max-w-none focus:outline-none"
          className="h-full"
          placeholder="Markdownを入力してください"
        />
      ) : (
        <div className="h-screen flex items-center justify-center">
          <p className="text-gray-500">
            ノートを選択するか、新しいノートを作成してください
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
