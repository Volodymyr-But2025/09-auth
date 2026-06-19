// "use client";

// import { useMemo, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { fetchNotes, type FetchNotesResponse } from "@/lib/api";
// import SearchBox from "@/components/SearchBox/SearchBox";
// import NoteList from "@/components/NoteList/NoteList";
// import Pagination from "@/components/Pagination/Pagination";
// import Modal from "@/components/Modal/Modal";
// import NoteForm from "@/components/NoteForm/NoteForm";
// import { useDebouncedCallback } from "use-debounce";

// function NotesClient({ filter }: { filter?: string }) {
//   const [query, setQuery] = useState("");
//   const [page, setPage] = useState(1);
//   const [isOpenModal, setIsOpenModal] = useState(false);

//   const queryKey = useMemo(
//     () => ["notes", query, page, filter] as const,
//     [query, page, filter],
//   );

//   const { data, isLoading, isError } = useQuery<
//     FetchNotesResponse,
//     Error,
//     FetchNotesResponse
//   >({
//     queryKey,
//     queryFn: () => fetchNotes({ query, page, ...(filter && { filter }) }),
//     staleTime: 1000 * 60,
//     refetchOnMount: false,
//   });

//   const notes = data?.notes ?? [];
//   const totalPages = data?.totalPages ?? 0;

//   const handleSearch = useDebouncedCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       setQuery(event.target.value);
//       setPage(1);
//     },
//     300,
//   );

//   //   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
//   //     setQuery(event.target.value);
//   //     setPage(1);
//   //   };

//   const handlePageChange = (nextPage: number) => {
//     setPage(nextPage);
//   };

//   const handleOpenModal = () => {
//     setIsOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setIsOpenModal(false);
//   };

//   return (
//     <div>
//       <header
//         style={{
//           display: "flex",
//           gap: "1rem",
//           flexWrap: "wrap",
//           alignItems: "center",
//           marginBottom: "1.5rem",
//         }}
//       >
//         <SearchBox onChange={handleSearch} />
//         {totalPages > 1 && (
//           <Pagination
//             currentPage={page}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         )}
//         <button
//           type="button"
//           onClick={handleOpenModal}
//           style={{ padding: "0.75rem 1rem", cursor: "pointer" }}
//         >
//           Create note +
//         </button>
//       </header>

//       {isLoading ? (
//         <p>Loading notes...</p>
//       ) : isError ? (
//         <p>Unable to load notes. Please try again.</p>
//       ) : notes.length > 0 ? (
//         <NoteList notes={notes} />
//       ) : (
//         <p>No notes found.</p>
//       )}

//       {isOpenModal && (
//         <Modal onClose={handleCloseModal}>
//           <NoteForm closeModal={handleCloseModal} />
//         </Modal>
//       )}
//     </div>
//   );
// }

// export default NotesClient;

"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes, type FetchNotesResponse } from "@/lib/api/clientApi";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import { useDebouncedCallback } from "use-debounce";

function NotesClient({ filter }: { filter?: string }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery<
    FetchNotesResponse,
    Error,
    FetchNotesResponse
  >({
    queryKey: ["notes", query, page, filter] as const,
    queryFn: () =>
      fetchNotes({
        query,
        page,
        ...(filter && filter.toLowerCase() !== "all" && { filter }),
      }),
    staleTime: 1000 * 60,
    refetchOnMount: false,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setPage(1);
    },
    300,
  );

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <div>
      <header
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <SearchBox onChange={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        <Link
          href="/notes/action/create"
          style={{ padding: "0.75rem 1rem", cursor: "pointer" }}
        >
          Create note +
        </Link>
      </header>

      {isLoading ? (
        <p>Loading notes...</p>
      ) : isError ? (
        <p>Unable to load notes. Please try again.</p>
      ) : notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
}

export default NotesClient;
