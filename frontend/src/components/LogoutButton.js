"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/");
  };

  return (
    <button
      onClick={logout}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}