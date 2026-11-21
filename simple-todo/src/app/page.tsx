import { auth } from "@/auth";
import { AuthButton } from "@/components/auth-button";
import { TaskForm } from "@/components/task-form";
import { TaskList } from "@/components/task-list";
import { Suspense } from "react";

async function AuthenticatedContent() {
  const session = await auth();
  if (!session?.user?.id) {
    return <p className="mx-auto my-16 text-2xl">タスク管理するにはログインしてください。</p>;
  }
  return (
    <div className="flex-1 min-h-0 mx-6 flex flex-col gap-8 overflow-hidden pb-4">
      <div className="shrink-0">
        <TaskForm />
      </div>
      <div className="flex-1 overflow-y-auto">
        <TaskList />
      </div>
    </div>
  );
}

export default async function Home() {
  return (
    <main className="flex-1 min-h-0 w-4/5 mx-auto flex flex-col">
      <div className="flex flex-row justify-between items-center py-4 shrink-0">
        <h1 className="text-4xl">Minimal Tasks</h1>
        <Suspense fallback={null}>
          <AuthButton />
        </Suspense>
      </div>
      
      <Suspense fallback={<p>Loading...</p>}>
        <AuthenticatedContent />
      </Suspense>
    </main>
  );
}
