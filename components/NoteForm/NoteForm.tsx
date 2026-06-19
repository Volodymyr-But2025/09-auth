"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import css from "./NoteForm.module.css";
import { useEffect, useId, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { createNote, type CreateNotePayload } from "@/lib/api/clientApi";
import { initialDraft, useNoteStore } from "@/lib/store/noteStore";
import type { NoteTag } from "@/types/note";

const NOTE_TAGS: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export type NoteFormValues = CreateNotePayload;

interface NoteFormProps {
  closeModal?: () => void;
}

type FormErrors = Partial<Record<keyof NoteFormValues, string>>;

const validateNoteForm = (values: NoteFormValues): FormErrors => {
  const errors: FormErrors = {};

  if (values.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  } else if (values.title.trim().length > 50) {
    errors.title = "Title must be at most 50 characters";
  }

  if (values.content.length > 500) {
    errors.content = "Content must be at most 500 characters";
  }

  if (!NOTE_TAGS.includes(values.tag)) {
    errors.tag = "Invalid tag";
  }

  return errors;
};

const NoteForm = ({ closeModal }: NoteFormProps) => {
  const fieldId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();
  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);
  const [values, setValues] = useState<NoteFormValues>(initialDraft);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setValues(draft);
  }, [draft]);

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();

      if (closeModal) {
        closeModal();
      } else {
        router.back();
      }
    },
  });

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    const updatedValues = {
      ...values,
      [name]: value,
    };

    setValues(updatedValues);
    setDraft(updatedValues);
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateNoteForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await createNoteMutation.mutateAsync(values);
  };

  const handleCancel = () => {
    if (closeModal) {
      closeModal();
    } else {
      router.back();
    }
  };

  const isSubmitting = createNoteMutation.status === "pending";

  return (
    <form className={css.form} onSubmit={handleSubmit} noValidate>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          className={css.input}
        />
        {errors.title ? (
          <span className={css.error}>{errors.title}</span>
        ) : null}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          value={values.content}
          onChange={handleChange}
          className={css.textarea}
        />
        {errors.content ? (
          <span className={css.error}>{errors.content}</span>
        ) : null}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          value={values.tag}
          onChange={handleChange}
          className={css.select}
        >
          {NOTE_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {errors.tag ? <span className={css.error}>{errors.tag}</span> : null}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={isSubmitting}
        >
          Create note
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
