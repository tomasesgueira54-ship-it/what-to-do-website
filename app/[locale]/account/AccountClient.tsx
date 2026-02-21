"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FaUser,
  FaEnvelope,
  FaClock,
  FaGoogle,
  FaKey,
  FaSignOutAlt,
  FaCalendarAlt,
  FaHeart,
  FaPodcast,
} from "react-icons/fa";

interface AccountClientProps {
  locale: "pt" | "en";
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    provider: string;
    createdAt: string;
  };
}

export default function AccountClient({ locale, user }: AccountClientProps) {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();
  const isPt = locale === "pt";

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push(`/${locale}`);
      router.refresh();
    } catch {
      setLogoutLoading(false);
    }
  };

  const createdDate = new Date(user.createdAt).toLocaleDateString(
    locale === "pt" ? "pt-PT" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isPt ? "Minha Conta" : "My Account"}
          </h1>
          <p className="text-brand-grey">
            {isPt
              ? "Gere o teu perfil e preferências"
              : "Manage your profile and preferences"}
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-brand-grey-dark/30 border border-brand-grey-dark rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full border-2 border-brand-red"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-brand-red/20 border-2 border-brand-red flex items-center justify-center">
                  <span className="text-2xl font-bold text-brand-red">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white truncate">
                {user.name}
              </h2>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3 text-brand-grey">
                  <FaEnvelope className="text-sm flex-shrink-0" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-brand-grey">
                  {user.provider === "google" ? (
                    <FaGoogle className="text-sm flex-shrink-0" />
                  ) : (
                    <FaKey className="text-sm flex-shrink-0" />
                  )}
                  <span className="text-sm">
                    {user.provider === "google"
                      ? isPt
                        ? "Conta Google"
                        : "Google Account"
                      : isPt
                        ? "Email e password"
                        : "Email and password"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-brand-grey">
                  <FaClock className="text-sm flex-shrink-0" />
                  <span className="text-sm">
                    {isPt
                      ? `Membro desde ${createdDate}`
                      : `Member since ${createdDate}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link
            href={`/${locale}/events`}
            className="bg-brand-grey-dark/30 border border-brand-grey-dark rounded-xl p-6 hover:border-brand-red transition-colors group"
          >
            <FaCalendarAlt className="text-2xl text-brand-red mb-3" />
            <h3 className="text-white font-semibold mb-1 group-hover:text-brand-red transition-colors">
              {isPt ? "Eventos" : "Events"}
            </h3>
            <p className="text-brand-grey text-sm">
              {isPt
                ? "Descobre o que fazer em Lisboa"
                : "Discover what to do in Lisbon"}
            </p>
          </Link>

          <Link
            href={`/${locale}/my-agenda`}
            className="bg-brand-grey-dark/30 border border-brand-grey-dark rounded-xl p-6 hover:border-brand-red transition-colors group"
          >
            <FaHeart className="text-2xl text-brand-red mb-3" />
            <h3 className="text-white font-semibold mb-1 group-hover:text-brand-red transition-colors">
              {isPt ? "Minha Agenda" : "My Agenda"}
            </h3>
            <p className="text-brand-grey text-sm">
              {isPt ? "Os teus eventos favoritos" : "Your favorite events"}
            </p>
          </Link>

          <Link
            href={`/${locale}/episodes`}
            className="bg-brand-grey-dark/30 border border-brand-grey-dark rounded-xl p-6 hover:border-brand-red transition-colors group"
          >
            <FaPodcast className="text-2xl text-brand-red mb-3" />
            <h3 className="text-white font-semibold mb-1 group-hover:text-brand-red transition-colors">
              {isPt ? "Podcast" : "Podcast"}
            </h3>
            <p className="text-brand-grey text-sm">
              {isPt ? "Ouve os nossos episódios" : "Listen to our episodes"}
            </p>
          </Link>
        </div>

        {/* Logout */}
        <div className="bg-brand-grey-dark/30 border border-brand-grey-dark rounded-xl p-6">
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
          >
            <FaSignOutAlt />
            <span className="font-medium">
              {logoutLoading
                ? isPt
                  ? "A sair..."
                  : "Signing out..."
                : isPt
                  ? "Terminar Sessão"
                  : "Sign Out"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
