import Link from "next/link";
import {
  FaSpotify,
  FaApple,
  FaYoutube,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { useTranslations } from "@/lib/use-translations";
import SubscribeForm from "./SubscribeForm";

interface FooterProps {
  locale?: "pt" | "en";
}

export default function Footer({ locale = "pt" }: FooterProps) {
  const t = useTranslations(locale);
  const socialLinks = [
    {
      name: "Spotify",
      url: process.env.NEXT_PUBLIC_SOCIAL_SPOTIFY || "",
      Icon: FaSpotify,
    },
    {
      name: "Apple Podcasts",
      url: process.env.NEXT_PUBLIC_SOCIAL_APPLE || "",
      Icon: FaApple,
    },
    {
      name: "YouTube",
      url: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || "https://youtube.com/@whattodo",
      Icon: FaYoutube,
    },
    {
      name: "Instagram",
      url:
        process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ||
        "https://instagram.com/whattodomedia",
      Icon: FaInstagram,
    },
    {
      name: "X",
      url: process.env.NEXT_PUBLIC_SOCIAL_X || "",
      Icon: FaTwitter,
    },
  ].filter((item) => item.url && /^https?:\/\//i.test(item.url));

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
              {t(
                "footer.description",
                "Descubra o que fazer através do nosso podcast e blog. Histórias inspiradoras, dicas práticas e entretenimento de qualidade.",
              )}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map(({ name, url, Icon }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    title={name}
                    className="text-brand-grey hover:text-brand-red transition-colors"
                  >
                    <Icon className="text-2xl" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">
              {t("footer.quick_links", "Links Rápidos")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/my-agenda`}
                  className="text-brand-grey hover:text-brand-red transition-colors"
                >
                  {t("footer.my_agenda_link", "Minha Agenda")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/podcast/cantinho-dos-segredos`}
                  className="text-brand-grey hover:text-brand-red transition-colors"
                >
                  {t("footer.cantinho", "Cantinho dos Segredos")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/episodes`}
                  className="text-brand-grey hover:text-brand-red transition-colors"
                >
                  {t("footer.episodes", "Episódios")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/blog`}
                  className="text-brand-grey hover:text-brand-red transition-colors"
                >
                  {t("footer.blog", "Blog")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-brand-grey hover:text-brand-red transition-colors"
                >
                  {t("footer.about", "Sobre")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/partners`}
                  className="text-brand-grey hover:text-brand-red transition-colors"
                >
                  {t("footer.partners", "Parcerias")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-4">
              {t("footer.newsletter", "Newsletter")}
            </h4>
            <p className="text-brand-grey text-sm mb-4">
              {t(
                "footer.newsletter_description",
                "Receba novos episódios e artigos diretamente no seu email.",
              )}
            </p>
            <SubscribeForm locale={locale} variant="footer" />
          </div>
        </div>

        <div className="border-t border-brand-grey/20 mt-8 pt-8 text-center text-brand-grey text-sm">
          <p>
            &copy; {new Date().getFullYear()} What To Do - Blog & Podcast.{" "}
            {t("footer.copyright", "Todos os direitos reservados.")}
          </p>
          <p className="mt-2">
            <Link
              href={`/${locale}/privacy`}
              className="hover:text-brand-red transition-colors"
            >
              {t("footer.privacy", "Privacidade")}
            </Link>{" "}
            ·{" "}
            <Link
              href={`/${locale}/terms`}
              className="hover:text-brand-red transition-colors"
            >
              {t("footer.terms", "Termos")}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
