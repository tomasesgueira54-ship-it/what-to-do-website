"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes, FaPodcast } from "react-icons/fa";

interface HeaderProps {
  locale?: "pt" | "en";
}

export default function Header({ locale = "pt" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { name: locale === "pt" ? "Eventos" : "Events", href: `/${locale}/events` },
    {
      name: locale === "pt" ? "Podcast" : "Podcast",
      href: `/${locale}/episodes`,
    },
    { name: locale === "pt" ? "Guias" : "Guides", href: `/${locale}/blog` },
    { name: locale === "pt" ? "Sobre" : "About", href: `/${locale}/about` },
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
                href="/pt"
                className={`text-sm transition-colors ${locale === "pt" ? "text-brand-red font-semibold" : "text-brand-grey hover:text-white"}`}
              >
                PT
              </Link>
              <span className="text-brand-grey">/</span>
              <Link
                href="/en"
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
            <li>
              <a href={`/${locale}#subscribe`} className="btn-primary">
                {locale === "pt" ? "Subscrever" : "Subscribe"}
              </a>
            </li>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white text-2xl focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            {/* Language Switcher Mobile */}
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/pt"
                className={`text-sm transition-colors ${locale === "pt" ? "text-brand-red font-semibold" : "text-brand-grey hover:text-white"}`}
              >
                PT
              </Link>
              <span className="text-brand-grey">/</span>
              <Link
                href="/en"
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
                  {locale === "pt" ? "Subscrever" : "Subscribe"}
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
