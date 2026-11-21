import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  isCompleted: boolean;
  createdAt: string;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString(
    "ja-JP",
    { 
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  );
}

export const getTasks = cache(async (): Promise<Task[]> => {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }
  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      isCompleted: false,
    },
    orderBy: {createdAt: "desc"},
    select: {
      id: true,
      title: true,
      description: true,
      dueDate: true,
      isCompleted: true,
      createdAt: true,
    },
  });

  return tasks.map(task => (
    {
      ...task,
      dueDate: task.dueDate ? formatDate(task.dueDate).replaceAll("/", "-") : null,
      createdAt: formatDate(task.createdAt),
    }
  ));
});
