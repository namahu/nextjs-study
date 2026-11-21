import { auth, signIn, signOut } from "@/auth";

export async function AuthButton() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <button
          type="submit"
          className="bg-zinc-50 border rounded-full text-sm px-6 py-2"
        >
          Githubでログイン
        </button>
      </form>
    )
  }

  return (
    <form 
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        type="submit"
        className="bg-zinc-50 border rounded-full text-sm px-6 py-2"
      >
        ログアウト
      </button>
    </form>
  )
}
