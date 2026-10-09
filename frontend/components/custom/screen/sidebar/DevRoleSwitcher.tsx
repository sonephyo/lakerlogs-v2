"use client";

import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { env } from "next-runtime-env";
import { demoUserAtom, userAtom } from "@/components/custom/utils/context/state";

const roles = ["student", "instructor", "co-instructor"] as const;
type Role = (typeof roles)[number];

export function DevRoleSwitcher() {
  const user = useAtomValue(userAtom);
  const demoUser = useAtomValue(demoUserAtom);
  const [selection, setSelection] = useState<Role | "">("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const authUrl = env("NEXT_PUBLIC_AUTH_API_URL") || "http://localhost:9084/auth/api";
  const { data } = useQuery({
    queryKey: ["dev-role-switch", user?.email],
    enabled: process.env.NODE_ENV === "development" && !!user && !demoUser,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await axios.get<{ role: Role }>(`${authUrl}/auth/dev/role`, {
        withCredentials: true,
      });
      return response.data;
    },
  });

  if (process.env.NODE_ENV !== "development" || !user || !data || demoUser) return null;
  const selectedRole = selection || data.role;

  async function switchRole() {
    setPending(true);
    setError("");
    try {
      const response = await axios.post<{ token: string; role: Role }>(
        `${authUrl}/auth/dev/role`, { role: selectedRole }, { withCredentials: true },
      );
      if (!response.data.token) throw new Error("No updated session was returned.");
      localStorage.setItem("csc_480_token", JSON.stringify(response.data.token));
      document.cookie = `token=${response.data.token}; path=/;`;
      // A full navigation clears old role queries and mounts the new identity together.
      window.location.assign(response.data.role === "student" ? "/home" : "/instructor");
    } catch (cause) {
      setError(axios.isAxiosError(cause)
        ? (typeof cause.response?.data?.message === "string"
          ? cause.response.data.message
          : "Role switch failed. Retry, or sign in again to refresh your session.")
        : "The session could not be updated. Sign in again to check your role.");
      setPending(false);
    }
  }

  return (
    <div className="mb-4 rounded-xl border border-white/20 bg-white/5 p-3">
      <label htmlFor="dev-role" className="text-sm font-semibold text-amber-300">Development role</label>
      <p className="mb-3 mt-1 text-xs leading-5 text-white/75">Changes your account in the development database.</p>
      <select id="dev-role" value={selectedRole} onChange={(event) => setSelection(event.target.value as Role)} disabled={pending} className="w-full rounded-lg border border-white/20 bg-[#173d2b] p-2 text-sm text-white focus-visible:outline-2 focus-visible:outline-amber-300">
        {roles.map((role) => <option key={role} value={role}>{role === "co-instructor" ? "Co-instructor" : role === "instructor" ? "Instructor" : "Student"}</option>)}
      </select>
      <button type="button" onClick={switchRole} disabled={pending || selectedRole === data.role} className="mt-2 w-full rounded-lg bg-amber-300 px-3 py-2 text-sm font-semibold text-[#1E4B35] hover:bg-amber-200 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">{pending ? "Switching…" : "Switch role"}</button>
      {error && <p role="alert" className="mt-2 text-xs text-red-200">{error}</p>}
    </div>
  );
}
