import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z.string(
    { error: issue => issue.input === undefined ? "タイトルを入力してください" : "タイトルは文字列で入力してください" }
  ).trim().min(1, "タイトルを入力してください"),
  description: z.string().nullable().default(""),
  dueDate: z.coerce.date().nullable().default(null),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
