import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import AccountClient from "./AccountClient";

interface AccountPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam === "en" ? "en" : "pt";

  if (!isSupabaseConfigured()) {
    redirect(`/${locale}/auth/login?error=supabase_not_configured`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <AccountClient
      locale={locale}
      user={{
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || user.email!.split("@")[0],
        avatarUrl: user.user_metadata?.avatar_url || null,
        provider: user.app_metadata?.provider || "email",
        createdAt: user.created_at,
      }}
    />
  );
}
