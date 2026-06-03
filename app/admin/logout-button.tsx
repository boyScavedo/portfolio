"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <button
      onClick={logout}
      className="rounded-full border border-[#2a2a2a] px-4 py-2 text-sm text-[#555] hover:border-red-900/50 hover:text-red-400 transition-colors"
    >
      Logout
    </button>
  );
}
