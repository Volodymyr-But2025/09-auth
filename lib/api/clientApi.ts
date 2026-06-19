import { Note, NoteTag } from "@/types/note";
import { nextServerInstance } from "./api";
import { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}
export interface RegisterPayload {
  email: string;
  password: string;
}

export interface CheckSessionResponse {
  success: boolean;
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
  const { data } = await nextServerInstance.get<FetchNotesResponse>("/notes", {
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
  const { data } = await nextServerInstance.delete<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const { data } = await nextServerInstance.post<Note>("/notes", note);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await nextServerInstance.get<Note>(`/notes/${id}`);
  return data;
};

export const register = async (userData: RegisterPayload): Promise<User> => {
  const { data } = await nextServerInstance.post<User>(
    "/auth/register",
    userData,
  );
  return data;
};

export const login = async (userData: RegisterPayload): Promise<User> => {
  const { data } = await nextServerInstance.post<User>("/auth/login", userData);
  return data;
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const { data } =
      await nextServerInstance.get<CheckSessionResponse>("/auth/session");
    return data.success === true;
  } catch {
    return false;
  }
};

export const getMe = async (): Promise<User> => {
  const { data } = await nextServerInstance.get<User>("/users/me");
  return data;
};

export const updateMe = async (
  userData: Partial<Pick<User, "username">>,
): Promise<User> => {
  const { data } = await nextServerInstance.patch<User>("/users/me", userData);
  return data;
};

export const logout = async () => {
  await nextServerInstance.post("/auth/logout");
};
