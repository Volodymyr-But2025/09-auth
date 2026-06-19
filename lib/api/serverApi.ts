import { cookies } from "next/headers";
import { nextServerInstance } from "./api";
import type { AxiosResponse } from "axios";
import { FetchNotesResponse } from "./clientApi";
import { Note } from "@/types/note";
import { User } from "@/types/user";

interface CheckSessionResponse {
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
  const cs = await cookies();
  const { data } = await nextServerInstance.get<FetchNotesResponse>("/notes", {
    params: {
      search: query,
      page,
      perPage: 12,
      sortBy: "created",
      ...(filter ? { tag: filter } : {}),
    },
    headers: { Cookie: cs.toString() },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cs = await cookies();
  const { data } = await nextServerInstance.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cs.toString() },
  });
  return data;
};

export const getMe = async (): Promise<User> => {
  const cs = await cookies();
  const { data } = await nextServerInstance.get<User>("/users/me", {
    headers: { Cookie: cs.toString() },
  });
  return data;
};

export const checkSession = async (): Promise<
  AxiosResponse<CheckSessionResponse>
> => {
  const cs = await cookies();
  return nextServerInstance.get<CheckSessionResponse>("/auth/session", {
    headers: { Cookie: cs.toString() },
  });
};
