"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaGoogle, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useTranslations } from "@/lib/use-translations";
import { createClient } from "@/lib/supabase/client";

const hasSupabaseConfig =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default function LoginPage({ params }: LoginPageProps) {
  const [locale, setLocale] = useState<"pt" | "en">("pt");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations(locale);

  // Resolve locale from params
  useState(() => {
    params.then((p) => {
      const l = p.locale === "en" ? "en" : "pt";
      setLocale(l);
    });
  });

  // Check for error in URL (from OAuth callback)
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setMessage({
        type: "error",
        text:
          locale === "pt"
            ? "Erro na autenticação. Tenta novamente."
            : "Authentication error. Please try again.",
      });
    }
  }, [searchParams, locale]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setTimeout(() => {
          router.push(`/${locale}/account`);
          router.refresh();
        }, 500);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({
        type: "error",
        text:
          locale === "pt"
            ? "Erro de ligação. Tenta novamente."
            : "Connection error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setMessage(null);

    if (!hasSupabaseConfig) {
      setMessage({
        type: "error",
        text:
          locale === "pt"
            ? "Login Google indisponível: falta configurar Supabase."
            : "Google login unavailable: Supabase is not configured.",
      });
      setGoogleLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/${locale}/account`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setMessage({
          type: "error",
          text:
            locale === "pt"
              ? "Erro ao ligar com o Google."
              : "Error connecting with Google.",
        });
        setGoogleLoading(false);
      }
    } catch {
      setMessage({
        type: "error",
        text: locale === "pt" ? "Erro de ligação." : "Connection error.",
      });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-brand-grey hover:text-white transition-colors mb-8"
        >
          <FaArrowLeft className="text-sm" />
          <span className="text-sm">
            {locale === "pt" ? "Voltar ao início" : "Back to home"}
          </span>
        </Link>

        {/* Card */}
        <div className="bg-brand-grey-dark/30 border border-brand-grey-dark rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {locale === "pt" ? "Entrar" : "Sign In"}
            </h1>
            <p className="text-brand-grey text-sm">
              {locale === "pt"
                ? "Acede à tua conta What To Do"
                : "Access your What To Do account"}
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            ) : (
              <FaGoogle className="text-lg" />
            )}
            <span>
              {locale === "pt"
                ? "Continuar com Google"
                : "Continue with Google"}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-brand-grey-dark" />
            <span className="text-brand-grey text-xs uppercase tracking-wider">
              {locale === "pt" ? "ou" : "or"}
            </span>
            <div className="flex-1 border-t border-brand-grey-dark" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brand-grey mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nome@email.com"
                className="w-full bg-brand-black border border-brand-grey-dark rounded-xl px-4 py-3 text-white placeholder:text-brand-grey/50 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brand-grey mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-brand-black border border-brand-grey-dark rounded-xl px-4 py-3 pr-12 text-white placeholder:text-brand-grey/50 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-grey hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-red hover:bg-brand-red-light text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>
                    {locale === "pt" ? "A entrar..." : "Signing in..."}
                  </span>
                </div>
              ) : locale === "pt" ? (
                "Entrar"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div
              className={`mt-4 p-4 rounded-xl text-sm ${
                message.type === "success"
                  ? "bg-green-900/30 border border-green-800 text-green-300"
                  : "bg-red-900/30 border border-red-800 text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Register link */}
          <p className="mt-6 text-center text-brand-grey text-sm">
            {locale === "pt" ? "Não tens conta? " : "Don't have an account? "}
            <Link
              href={`/${locale}/auth/register`}
              className="text-brand-red hover:text-brand-red-light font-semibold transition-colors"
            >
              {locale === "pt" ? "Criar Conta" : "Sign Up"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
