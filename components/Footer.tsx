import Link from "next/link";
import {
  FaSpotify,
  FaApple,
  FaYoutube,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import SubscribeForm from "./SubscribeForm";

interface FooterProps {
  locale?: "pt" | "en";
}

export default function Footer({ locale = "pt" }: FooterProps) {
  const isPortuguese = locale === "pt";

  return (
    <footer className="bg-brand-grey-dark border-t border-brand-grey/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-display text-2xl font-bold mb-4 text-brand-red">
              What To Do
            </h3>
            <p className="text-brand-grey mb-4">
              {isPortuguese
                ? "Descubra o que fazer através do nosso podcast e blog. Histórias inspiradoras, dicas práticas e entretenimento de qualidade."
                : "Discover what to do through our podcast and blog. Inspiring stories, practical tips and quality entertainment."}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://open.spotify.com/show/whattodo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-grey hover:text-brand-red transition-colors"
              >
                <FaSpotify className="text-2xl" />
              </a>
              <a
                href="https://podcasts.apple.com/podcast/what-to-do"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-grey hover:text-brand-red transition-colors"
              >
                <FaApple className="text-2xl" />
              </a>
              <a
                href="https://youtube.com/@whattodo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-grey hover:text-brand-red transition-colors"
              >
                <FaYoutube className="text-2xl" />
              </a>
              <a
                href="https://instagram.com/whattodomedia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-grey hover:text-brand-red transition-colors"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://twitter.com/whattodo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-grey hover:text-brand-red transition-colors"
              >
                <FaTwitter className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">
              {isPortuguese ? "Links Rápidos" : "Quick Links"}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/episodes`}
                  className="text-brand-grey hover:text-brand-red transition-colors"
                >
                  {isPortuguese ? "Episódios" : "Episodes"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/blog`}
                  className="text-brand-grey hover:text-brand-red transition-colors"
                >
                  {isPortuguese ? "Blog" : "Blog"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-brand-grey hover:text-brand-red transition-colors"
                >
                  {isPortuguese ? "Sobre" : "About"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-4">
              {isPortuguese ? "Newsletter" : "Newsletter"}
            </h4>
            <p className="text-brand-grey text-sm mb-4">
              {isPortuguese
                ? "Receba novos episódios e artigos diretamente no seu email."
                : "Receive new episodes and articles directly in your email."}
            </p>
            <SubscribeForm locale={locale} variant="footer" />
          </div>
        </div>

        <div className="border-t border-brand-grey/20 mt-8 pt-8 text-center text-brand-grey text-sm">
          <p>
            &copy; {new Date().getFullYear()} What To Do - Blog & Podcast.{" "}
            {isPortuguese
              ? "Todos os direitos reservados."
              : "All rights reserved."}
          </p>
          <p className="mt-2">
            <Link
              href={`/${locale}/privacy`}
              className="hover:text-brand-red transition-colors"
            >
              {isPortuguese ? "Privacidade" : "Privacy"}
            </Link>{" "}
            ·{" "}
            <Link
              href={`/${locale}/terms`}
              className="hover:text-brand-red transition-colors"
            >
              {isPortuguese ? "Termos" : "Terms"}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
