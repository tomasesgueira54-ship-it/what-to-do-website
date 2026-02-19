"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaPodcast } from "react-icons/fa";
import { useTranslations } from "@/lib/use-translations";

interface HeaderProps {
  locale?: "pt" | "en";
}

export default function Header({ locale = "pt" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations(locale);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const buildLocaleHref = (targetLocale: "pt" | "en") => {
    if (!pathname || pathname === "/") return `/${targetLocale}`;
    const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;

    if (normalized === "/pt" || normalized === "/en") {
      return `/${targetLocale}`;
    }

    if (normalized.startsWith("/pt/")) {
      return normalized.replace("/pt/", `/${targetLocale}/`);
    }

    if (normalized.startsWith("/en/")) {
      return normalized.replace("/en/", `/${targetLocale}/`);
    }

    return `/${targetLocale}${normalized}`;
  };

  const menuItems = [
    { name: t("header.events", "Events"), href: `/${locale}/events` },
    {
      name: t("header.my_agenda", "My Agenda"),
      href: `/${locale}/my-agenda`,
    },
    {
      name: t("header.partners", "Partners"),
      href: `/${locale}/partners`,
    },
    {
      name: t("header.podcast", "Podcast"),
      href: `/${locale}/episodes`,
    },
    { name: t("header.blog", "Guides"), href: `/${locale}/blog` },
    { name: t("header.about", "About"), href: `/${locale}/about` },
  ];

  return (
    <header className="sticky top-0 z-50 bg-brand-black/95 backdrop-blur-sm border-b border-brand-grey-dark">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center space-x-3 group"
          >
            <div className="bg-brand-red p-2 rounded-lg group-hover:bg-brand-red-light transition-colors">
              <FaPodcast className="text-2xl text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-white">
              What To Do
            </span>
          </Link>

          {/* Language Switcher + Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <Link
                href={buildLocaleHref("pt")}
                className={`text-sm transition-colors ${locale === "pt" ? "text-brand-red font-semibold" : "text-brand-grey hover:text-white"}`}
              >
                PT
              </Link>
              <span className="text-brand-grey">/</span>
              <Link
                href={buildLocaleHref("en")}
                className={`text-sm transition-colors ${locale === "en" ? "text-brand-red font-semibold" : "text-brand-grey hover:text-white"}`}
              >
                EN
              </Link>
            </div>

            {/* Menu Items */}
            <ul className="flex items-center space-x-8">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-brand-white hover:text-brand-red transition-colors font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Subscribe Button */}
            <div>
              <a href={`/${locale}#subscribe`} className="btn-primary">
                {t("header.subscribe", "Subscribe")}
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white text-2xl focus:outline-none"
            aria-label={t("header.toggle_menu", "Toggle menu")}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            {/* Language Switcher Mobile */}
            <div className="flex items-center gap-2 mb-4">
              <Link
                href={buildLocaleHref("pt")}
                className={`text-sm transition-colors ${locale === "pt" ? "text-brand-red font-semibold" : "text-brand-grey hover:text-white"}`}
              >
                PT
              </Link>
              <span className="text-brand-grey">/</span>
              <Link
                href={buildLocaleHref("en")}
                className={`text-sm transition-colors ${locale === "en" ? "text-brand-red font-semibold" : "text-brand-grey hover:text-white"}`}
              >
                EN
              </Link>
            </div>

            <ul className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="block text-brand-white hover:text-brand-red transition-colors font-medium"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`/${locale}#subscribe`}
                  className="btn-primary w-full block text-center"
                  onClick={toggleMenu}
                >
                  {t("header.subscribe", "Subscribe")}
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
