import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { LoginForm } from "@/components/login-form";
import { SetupNotice } from "@/components/setup-notice";
import { isConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in" };
export default async function LoginPage() {
  const configured = isConfigured();
  if (configured) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (data?.claims.sub) redirect("/queue");
  }
  return (
    <main
      id="main"
      className="grid-container flex min-h-screen flex-col bg-paper py-6"
    >
      <Link href="/" className="w-fit" aria-label="ERgency home">
        <BrandMark />
      </Link>
      <div className="mx-auto my-auto w-full max-w-md py-16">
        <h1 className="text-h2 mb-8">Staff sign in</h1>
        {configured ? <LoginForm /> : <SetupNotice />}
      </div>
      <p className="text-sm">Supporting clinical judgement, never replacing it.</p>
    </main>
  );
}
