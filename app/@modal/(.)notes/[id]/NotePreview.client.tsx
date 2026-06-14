// "use client";

// import { useRouter } from "next/navigation";
// import type { Note } from "@/types/note";
// import Modal from "@/components/Modal/Modal";
// import css from "./NotePreview.module.css";

// interface NotePreviewClientProps {
//   note: Note;
// }

// const NotePreviewClient = ({ note }: NotePreviewClientProps) => {
//   const router = useRouter();

//   const handleCloseModal = () => {
//     router.back();
//   };

//   return (
//     <Modal onClose={handleCloseModal}>
//       <div className={css.container}>
//         <button
//           onClick={handleCloseModal}
//           style={{ position: "absolute", top: "10px", right: "10px" }}
//           type="button"
//           aria-label="Close modal"
//         >
//           ✕
//         </button>
//         <div className={css.item}>
//           <div className={css.header}>
//             <h2>{note.title}</h2>
//           </div>
//           <p className={css.tag}>{note.tag}</p>
//           <p className={css.content}>{note.content}</p>
//           <p className={css.date}>
//             {new Date(note.createdAt).toLocaleString()}
//           </p>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default NotePreviewClient;

"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api"; // Імпортуємо функцію запиту за ID
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";

interface NotePreviewClientProps {
  id: string; // ВИПРАВЛЕНО: тепер очікуємо id замість цілого об'єкта note
}

const NotePreviewClient = ({ id }: NotePreviewClientProps) => {
  const router = useRouter();

  const handleCloseModal = () => {
    router.back();
  };

  // ВИПРАВЛЕНО: Отримуємо дані через useQuery згідно з вимогами ТЗ
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id], // Використовуємо "note" в однині, як у попередньому завданні
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false, // Обов'язкова вимога з ТЗ
  });

  return (
    <Modal onClose={handleCloseModal}>
      <div className={css.container}>
        <button
          onClick={handleCloseModal}
          style={{ position: "absolute", top: "10px", right: "10px" }}
          type="button"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* ВИПРАВЛЕНО: Обробка станів завантаження, помилки та рендер даних */}
        {isLoading ? (
          <p style={{ padding: "2rem", textAlign: "center" }}>
            Loading note details...
          </p>
        ) : isError ? (
          <p style={{ padding: "2rem", textAlign: "center", color: "red" }}>
            Failed to load note. Please try again.
          </p>
        ) : note ? (
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>
              {new Date(note.createdAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <p style={{ padding: "2rem", textAlign: "center" }}>
            Note not found.
          </p>
        )}
      </div>
    </Modal>
  );
};

export default NotePreviewClient;
