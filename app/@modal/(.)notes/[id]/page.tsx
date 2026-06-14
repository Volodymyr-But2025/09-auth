import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import NotePreviewClient from "./NotePreview.client";

interface NotePreviewProps {
  params: Promise<{
    id: string;
  }>;
}
const NotePreview = async ({ params }: NotePreviewProps) => {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const note = queryClient.getQueryData<Note>(["note", id]);

  if (!note) return null;
  const dehydratedState: DehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
};

export default NotePreview;
