import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: "Create note | NoteHub",
  description:
    "Create a new note with the NoteHub form and save it to your notes list.",

  openGraph: {
    title: "Create note | NoteHub",
    description:
      "Create a new note with the NoteHub form and save it to your notes list.",
    url: "https://notehub.example.com/notes/action/create",
    images: [
      {
        url: "https://notehub.example.com/images/create-note-og.png",
        alt: "Create note page",
      },
    ],
  },
};

const CreateNote = () => {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
};

export default CreateNote;
