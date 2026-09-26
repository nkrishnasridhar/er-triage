import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type StaffRole = "clinician" | "nurse" | "admin";

export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims.sub) redirect("/login");
  return {
    supabase,
    userId: data.claims.sub,
    email: String(data.claims.email ?? ""),
  };
}

/** Reads the database-enforced staff role for authenticated desktop pages. */
export async function requireStaff() {
  const user = await requireUser();
  const { data, error } = await user.supabase.rpc("current_staff_role");
  if (error || !isStaffRole(data)) redirect("/login");
  return { ...user, role: data };
}

export async function requireClinician() {
  const staff = await requireStaff();
  if (staff.role !== "clinician") redirect("/queue");
  return staff;
}

function isStaffRole(value: unknown): value is StaffRole {
  return value === "clinician" || value === "nurse" || value === "admin";
}
