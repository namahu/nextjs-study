"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreateTaskSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

// Server Actionsの実行結果（成否およびエラー詳細）を
// クライアント側のUIコンポーネントへ安全に受け渡すための戻り値の型（状態の型）
export type ActionState = {
  success?: boolean,
  errors?: {
    title?: string[],
    description?: string[],
    dueDate?: string[],
    _form?: string[],
  }
}

export const createTask = async (_prevState: ActionState | null, formData: FormData): Promise<ActionState> => {
  // sessionの検証
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      errors: {
        _form: ["ログインが必要です。"],
      },
    };
  }

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    dueDate: formData.get("dueDate"),
  };

  const validationResult = CreateTaskSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      errors: z.flattenError(validationResult.error).fieldErrors,
    };
  }

  const { title, description, dueDate } = validationResult.data;

  try {
    await prisma.task.create({
      data: {
        userId: session.user.id,
        title,
        description,
        dueDate,
      }
    });

    revalidatePath("/");
    return { success: true };
    
  } catch(err) {
    console.error(err);
    return {
      success: false,
      errors: {
        _form: ["タスクの作成に失敗しました。"],
      },
    };
  }
};

export const toggleTaskComplete = async (id: string, isCompleted: boolean): Promise<ActionState> => {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      errors: {
        _form: ["ログインが必要です"],
      },
    };
  }

  try {
    await prisma.task.update({
      where: { id, userId: session.user.id },
      data: { isCompleted },
    });

    revalidatePath("/");
    return { success: true };
  } catch(err) {
    console.error(err);
    return {
      success: false,
      errors: {
        _form: ["タスクの更新に失敗しました。"],
      },
    };
  }
}

export const updateDueDate = async (id: string, dueDate: string): Promise<ActionState>  => {
    const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      errors: {
        _form: ["ログインが必要です"],
      },
    };
  }

  try {
    await prisma.task.update({
      where: { id, userId: session.user.id },
      data: { dueDate: dueDate !== "" ? new Date(dueDate) : null },
    });
    revalidatePath("/");
    return { success: true };
  } catch(err) {
    console.error(err);
    return {
      success: false,
      errors: {
        _form: ["タスクの更新に失敗しました。"],
      },
    };
  }
}

export const updateDescription = async (id: string, description: string): Promise<ActionState>  => {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      errors: {
        _form: ["ログインが必要です"],
      },
    };
  }

  try {
    await prisma.task.update({
      where: { id, userId: session.user.id },
      data: { description },
    });
    revalidatePath("/");
    return { success: true };
  } catch(err) {
    console.error(err);
    return {
      success: false,
      errors: {
        _form: ["タスクの更新に失敗しました。"],
      },
    };
  }
}

