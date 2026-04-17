"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { USER_PROFILE } from "@/lib/constants";

const VALID_EMAIL = "testjjn@telekom.de";
const VALID_PASSWORD = "Test2026.";
const SESSION_COOKIE = "we-session";

export async function login(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
    return { error: "E-Mail oder Passwort ist falsch." };
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  redirect("/");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/login");
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value === "authenticated";
}

export async function getUserProfile() {
  return USER_PROFILE;
}
