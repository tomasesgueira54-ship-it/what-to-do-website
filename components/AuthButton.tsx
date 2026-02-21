"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const hasSupabaseConfig =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

interface AuthButtonProps {
  locale: "pt" | "en";
}

export default function AuthButton({ locale }: AuthButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(hasSupabaseConfig);
  const isPt = locale === "pt";

  useEffect(() => {
    if (!hasSupabaseConfig) {
      return;
    }

    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-brand-grey-dark animate-pulse" />
    );
  }

  if (user) {
    const name =
      user.user_metadata?.full_name || user.email?.split("@")[0] || "U";
    const avatarUrl = user.user_metadata?.avatar_url;

    return (
      <Link
        href={`/${locale}/account`}
        className="flex items-center gap-2 text-brand-grey hover:text-white transition-colors"
        title={isPt ? "Minha Conta" : "My Account"}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full border border-brand-red"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-red/20 border border-brand-red flex items-center justify-center">
            <span className="text-xs font-bold text-brand-red">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="hidden lg:inline text-sm font-medium text-white truncate max-w-[120px]">
          {name}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/${locale}/auth/login`}
      className="flex items-center gap-2 text-brand-grey hover:text-white transition-colors text-sm font-medium"
    >
      <FaUser className="text-xs" />
      <span>{isPt ? "Entrar" : "Sign In"}</span>
    </Link>
  );
}
