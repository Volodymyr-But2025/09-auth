import axios from "axios";
import type { Note, NoteTag } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (token) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async ({
  query,
  page,
  filter,
}: {
  query: string;
  page: number;
  filter?: string;
}): Promise<FetchNotesResponse> => {
  const { data } = await axios.get<FetchNotesResponse>("/notes", {
    params: {
      search: query,
      page,
      perPage: 12,
      sortBy: "created",
      ...(filter ? { tag: filter } : {}),
    },
  });
  console.log("Fetched notes data:", data);
  console.log("Query parameters:", {
    params: {
      search: query,
      page,
      perPage: 12,
      sortBy: "created",
      ...(filter ? { tag: filter } : {}),
    },
  });
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await axios.delete<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const { data } = await axios.post<Note>("/notes", note);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await axios.get<Note>(`/notes/${id}`);
  return data;
};
