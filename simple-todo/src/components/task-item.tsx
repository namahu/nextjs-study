"use client";

import { ActionState, toggleTaskComplete, updateDescription, updateDueDate } from "@/actions/tasks";
import { Task } from "@/data/tasks";
import React, { useTransition } from "react";
import { toast } from "sonner";

type TaskItemProps = {
  task: Task;
};

export function TaskItem({task}: TaskItemProps) {
  const [isPending, startTransition] = useTransition();

  const showTaskUpdateErrorToast = (result: ActionState) => {
    toast.error(result.errors?._form?.[0] ?? "タスクの更新に失敗しました。");
  }

  const handleTaskComplete = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;
    startTransition(async () => {
      try {
        const result = await toggleTaskComplete(task.id, !task.isCompleted);
        if (!result.success) {
          showTaskUpdateErrorToast(result);
          currentTarget.checked = task.isCompleted;
        }
      } catch {
        toast.error("通信エラーが発生しました。");
        currentTarget.checked = task.isCompleted;
      }
    });
  };

  const handleTaskUpdate = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    targetId: string,
    currentValue: string | null,
    updateFunc: (id: string, value: string) => Promise<ActionState>,
   ) => {
    const currentTarget = event.currentTarget;
    const nextValue = currentTarget.value;
    if (nextValue !== (currentValue ?? "")) {
      try {
        startTransition(async () => {
          const result = await updateFunc(targetId, nextValue);
          if (!result.success) {
            showTaskUpdateErrorToast(result);
            currentTarget.value = currentValue ?? "";
          }
        });
      } catch {
        toast.error("通信エラーが発生しました。");
        currentTarget.value = currentValue ?? "";
      }
    }
  }

  return (
    <li className="min-h-24 bg-zinc-50 border rounded-md p-2 grid grid-rows-1 grid-cols-[48px_1fr_50%] items-center gap-4">
      
      {/* Checkbox */}
      <label className="px-2 flex items-center">
        <input
          type="checkbox"
          defaultChecked={task.isCompleted}
          disabled={isPending}
          onChange={handleTaskComplete}
          className="h-8 w-8 accent-green-600"
        />
      </label>
      
      {/* Task title & Date */}
      <div className="flex flex-col">

        {/* Task title */}
        <span className="text-2xl">{task.title}</span>

        {/* Create & Due date */}
        <div className="flex flex-row items-center gap-2">

          {/* CreatedAt */}
          <div className="flex flex-row items-center">
            <span
              className="bg-zinc-50 text-zinc-500 text-sm"
            >
              Created date:
            </span>
            <span className="p-2">
              {task.createdAt}
            </span>
          </div>

          {/* Due date */}
          <div className="flex flex-row items-center relative">
            <label
              htmlFor={`dueDate-${task.id}`}
              className="bg-zinc-50 text-zinc-500 text-sm"
            >
              Due date:
            </label>
            <input
              id={`dueDate-${task.id}`}
              type="date"
              defaultValue={task.dueDate ?? ""}
              onBlur={(e) => {
                handleTaskUpdate(e, task.id, task.dueDate, updateDueDate);
              }}
              className="p-2"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="border rounded-md p-1 flex flex-row items-center relative">
        <label
          htmlFor={`description-${task.id}`}
          className="absolute top-[-10px] left-2 bg-zinc-50 text-zinc-500 text-sm px-2"
        >
          Description
        </label>
        <textarea
          id={`description-${task.id}`}
          defaultValue={task.description ?? ""}
          onBlur={(e) => {
            handleTaskUpdate(e, task.id, task.description, updateDescription);
          }}
          className="w-full px-2 py-1 focus:outline-none resize-none"
        />
      </div>
    </li>
  );
}
