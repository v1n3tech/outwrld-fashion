"use client";

import { useContext } from "react";
import { SessionContext } from "@/app/layout";
import { useRouter } from "next/navigation";

export function AuthButton() {
  const { session, supabase } = useContext(SessionContext);
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  if (session) {
    return <button onClick={handleSignOut}>Logout</button>;
  }

  return <button onClick={() => router.push("/auth/login")}>Login</button>;
}
