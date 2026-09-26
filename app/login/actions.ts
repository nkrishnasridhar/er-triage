"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { emailSchema, passwordSchema, type FormState } from "@/lib/validation";

export async function signIn(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  const email = emailSchema.safeParse(form.get("email"));
  const password = passwordSchema.safeParse(form.get("password"));
  if (!email.success || !password.success)
    return { error: "Enter your email address and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.data,
    password: password.data,
  });
  if (error)
    return {
      error: "That email address or password is not recognised. Try again.",
    };
  // The first authenticated account becomes the demo clinician through an
  // audited, one-time database bootstrap. Later sign-ins remain read-only
  // unless an operator assigns a clinician role in the database.
  await supabase.rpc("bootstrap_first_clinician");
  revalidatePath("/", "layout");
  redirect("/queue");
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("Could not sign out. Please try again.");
  revalidatePath("/", "layout");
  redirect("/login");
}
