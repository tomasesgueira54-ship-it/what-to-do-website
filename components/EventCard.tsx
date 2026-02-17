import Image from "next/image";
import { Event } from "@/data/types";
import { FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt } from "react-icons/fa";

interface EventCardProps {
  event: Event;
  locale?: "pt" | "en";
}

export default function EventCard({ event, locale = "pt" }: EventCardProps) {
  const dateLocale = locale === "pt" ? "pt-PT" : "en-US";
  const eventDate = new Date(event.date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = eventDate.toDateString() === today.toDateString();
  const isTomorrow = eventDate.toDateString() === tomorrow.toDateString();

  const formattedDate = eventDate.toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "short",
  });
  const formattedTimeStart = eventDate.toLocaleTimeString(dateLocale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endDate = event.endDate ? new Date(event.endDate) : null;
  const formattedTimeEnd = endDate
    ? endDate.toLocaleTimeString(dateLocale, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const normalizedPrice =
    event.price ||
    (locale === "pt" ? "Preço indisponível" : "Price unavailable");
  const isPriceFree =
    normalizedPrice.toLowerCase().includes("grátis") ||
    normalizedPrice.toLowerCase() === "free";
  const priceClass = isPriceFree
    ? "bg-green-500/15 border-green-500/40 text-green-300 shadow-[0_0_12px_rgba(74,222,128,0.15)]"
    : "bg-brand-red/15 border-brand-red/40 text-brand-red-light shadow-[0_0_12px_rgba(142,13,60,0.15)]";

  const timeLabel = isToday
    ? locale === "pt"
      ? "Hoje"
      : "Today"
    : isTomorrow
      ? locale === "pt"
        ? "Amanhã"
        : "Tomorrow"
      : formattedDate;

  return (
    <div className="bg-brand-black-light rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_30px_-5px_rgba(142,13,60,0.4)] hover:-translate-y-1 transition-all duration-300 border border-white/5 ring-1 ring-white/5 hover:border-brand-red/50 hover:ring-brand-red/50 group h-full flex flex-col relative z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-grey-dark z-10">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-grey group-hover:scale-110 transition-transform duration-500">
            <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500">
              📅
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

        {/* Date Badge over Image */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 flex flex-col items-center text-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
          <span className="text-xs font-bold text-brand-red uppercase tracking-wider">
            {eventDate
              .toLocaleDateString(dateLocale, { month: "short" })
              .replace(".", "")}
          </span>
          <span className="text-xl font-black text-white leading-none">
            {eventDate.getDate()}
          </span>
        </div>

        {/* Categories Over Image */}
        <div className="absolute top-3 left-3 flex gap-2">
          {event.category && (
            <span className="bg-brand-red/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg backdrop-blur-sm uppercase tracking-wide">
              {event.category}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-3 relative z-10 bg-brand-black-light/95 backdrop-blur-sm">
        {/* Time and Price Row */}
        <div className="flex items-center justify-between gap-3 p-3 bg-gradient-to-r from-brand-black/50 to-transparent rounded-xl border border-white/5 hover:border-brand-red/30 transition-colors duration-300">
          {/* Time Badge */}
          <div className="flex items-center gap-2 bg-brand-black/40 px-3 py-2 rounded-lg border border-brand-red/20">
            <FaCalendarAlt className="text-brand-red text-sm flex-shrink-0" />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] text-brand-grey font-bold uppercase tracking-wider opacity-70">
                {timeLabel}
              </span>
              <span className="text-sm font-bold text-white tracking-wide">
                {formattedTimeStart}
                {formattedTimeEnd ? ` — ${formattedTimeEnd}` : ""}
              </span>
              {endDate &&
                endDate.toDateString() !== eventDate.toDateString() && (
                  <span className="text-[10px] text-brand-grey mt-0.5">
                    até{" "}
                    {endDate.toLocaleDateString(dateLocale, {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                )}
            </div>
          </div>

          {/* Price Badge */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-bold text-xs uppercase tracking-wider flex-shrink-0 ${priceClass}`}
          >
            <span className="text-[10px] opacity-75">💰</span>
            {normalizedPrice}
          </div>
        </div>

        <h3 className="text-lg font-bold text-white leading-snug line-clamp-2 min-h-[3rem] group-hover:text-brand-red transition-colors duration-300">
          {event.title}
        </h3>

        {/* Hide long descriptions in cards; only show inside event page */}
        <p className="text-brand-grey text-xs italic flex-1 hidden sm:block">
          {locale === "pt"
            ? "Descrição disponível na página do evento."
            : "Description available on the event page."}
        </p>

        <div className="mt-auto flex items-center justify-between text-brand-grey-light text-xs pt-4 border-t border-dashed border-white/10">
          <span className="flex items-center gap-1.5 truncate max-w-[70%] group-hover:text-white transition-colors duration-300">
            <FaMapMarkerAlt className="text-brand-red flex-shrink-0" />{" "}
            {event.location}
          </span>
          <span className="flex items-center gap-1.5 text-brand-red text-[10px] font-bold uppercase tracking-wider bg-brand-red/10 px-2 py-1 rounded-full group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
            {locale === "pt" ? "Ver Mais" : "View More"}{" "}
            <FaTicketAlt size={10} />
          </span>
        </div>
      </div>
    </div>
  );
}
