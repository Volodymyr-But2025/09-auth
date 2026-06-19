import type { DehydratedState } from "@tanstack/react-query";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { id } = await params;
//   const note = await getSingleNote(id);
//   return {
//     title: `Note: ${note.title}`,
//     description: note.content.slice(0, 30),
//     openGraph: {
//       title: `Note: ${note.title}`,
//       description: note.content.slice(0, 100),
//       url: `https://notehub.com/notes/${id}`,
//       siteName: "NoteHub",
//       images: [
//         {
//           url: "https://ac.goit.global/fullstack/react/og-meta.jpg",
//           width: 1200,
//           height: 630,
//           alt: note.title,
//         },
//       ],
//       type: "article",
//     },
//   };
// }

export const dynamic = "force-dynamic";

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}
export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug[0];
  return {
    title: `Notes: ${filter} | NoteHub`,
    description: `Browse notes filtered by ${filter} category`,
    openGraph: {
      title: `Notes: ${filter} | NoteHub`,
      description: `Browse notes filtered by ${filter} category`,
      url: `https://notehub.example.com/notes/filter/${filter}`,
      type: "website",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          alt: `${filter} notes`,
        },
      ],
    },
  };
}

const NotesPage = async ({ params }: NotesPageProps) => {
  const { slug } = await params;
  const filter = slug[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, filter] as const,
    queryFn: () =>
      fetchNotes({
        query: "",
        page: 1,
        ...(filter && filter.toLowerCase() !== "all" && { filter }),
      }),
  });

  const dehydratedState: DehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient filter={filter} />
    </HydrationBoundary>
  );
};

export default NotesPage;
