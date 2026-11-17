export { auth as proxy } from "@/auth";

export const config = {
  // 静的アセット（画像やフォント、favicon）や内部APIを除外する正規表現マッチャー
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
