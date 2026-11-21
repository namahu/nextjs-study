"use client";

import { useActionState, useEffect, useRef } from "react";
import { type ActionState, createTask } from "@/actions/tasks";

const initialState: ActionState = {};

export function TaskForm() {
  const [state, formAction, isPending] = useActionState(createTask, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // 登録が成功したらフォームをリセットする
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div>
      {/* フォーム全体のエラー */}
      {state.errors?._form && (
        <div className="text-red-400 font-bold">
          {state.errors._form.join(", ")}
        </div>
      )}
      {/* titleフィールドのバリデーションエラー */}
      {state.errors?.title && (
        <div className="text-red-400 font-bold">
          {state.errors.title.join(", ")}
        </div>
      )}

      <form
        ref={formRef}
        action={formAction}
        className="bg-zinc-50 border rounded-md"
      >

        <div className="mx-4 my-2 flex flex-row justify-between">
          <input
            type="text"
            name="title"
            placeholder="新しいタスクを入力..."
            disabled={isPending}
            aria-invalid={!!state.errors?.title}
            className="w-7/8 text-xl px-4 py-2"
          />

          <button
            type="submit"
            disabled={isPending}
            className="bg-green-600 font-bold text-slate-50 rounded-md px-8"
          >
            {isPending ? "追加中..." : "追加"}
          </button>

        </div>
      </form>
    </div>
  );
}
