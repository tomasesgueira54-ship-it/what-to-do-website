import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";

async function getEvent(id: string) {
  try {
    const filePath = path.join(process.cwd(), "data", "events.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const events = JSON.parse(fileContent);
    return events.find((e: any) => e.id === id);
  } catch (error) {
    return null;
  }
}

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEvent(params.id);

  if (!event) {
    notFound();
  }

  const dateObj = new Date(event.date);
  const dateStr = dateObj.toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = dateObj.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const normalizedPrice = event.price || "Preço indisponível";
  const endDateStr = event.endDate
    ? new Date(event.endDate).toLocaleDateString("pt-PT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-brand-black pb-20">
      {/* Hero Image */}
      <div className="relative h-[50vh] w-full bg-brand-grey-dark overflow-hidden">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover opacity-60"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-brand-grey text-6xl opacity-20">
            📅
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />

        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/events"
            className="flex items-center gap-2 bg-brand-black/50 backdrop-blur px-4 py-2 rounded-full text-white hover:bg-brand-red transition-colors"
          >
            <FaArrowLeft /> Voltar
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-brand-black-light p-8 rounded-2xl shadow-2xl border border-brand-grey-dark/30">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div className="flex-1">
              <span className="text-brand-red font-bold tracking-widest text-sm uppercase mb-2 block">
                {event.source}
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
                {event.title}
              </h1>

              <div className="flex flex-col gap-3 text-brand-grey-light mb-8">
                <div className="flex items-center gap-3 text-lg">
                  <FaCalendarAlt className="text-brand-red" />
                  <span>
                    {dateStr} às {timeStr}
                  </span>
                </div>
                {endDateStr && (
                  <div className="flex items-center gap-3 text-sm text-brand-grey">
                    <FaCalendarAlt className="text-brand-red" />
                    <span>Termina em {endDateStr}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-lg">
                  <FaMapMarkerAlt className="text-brand-red" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <FaTicketAlt className="text-brand-red" />
                  <span>{normalizedPrice}</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none mb-8">
                <h3 className="text-xl font-bold mb-4">Sobre o evento</h3>
                <p className="text-brand-grey text-lg leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>

            <div className="md:w-80 flex flex-col gap-4">
              <div className="bg-brand-black p-6 rounded-xl border border-brand-grey-dark/30 sticky top-24">
                <h3 className="font-bold text-xl mb-4">Bilhetes e Info</h3>
                {event.url ? (
                  <Link
                    href={event.url}
                    target="_blank"
                    className="btn-primary w-full flex items-center justify-center gap-2 mb-3 px-4 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded shadow transition-all transform hover:scale-105"
                  >
                    Comprar Bilhetes <FaExternalLinkAlt size={14} />
                  </Link>
                ) : (
                  <button
                    className="btn-primary w-full opacity-50 cursor-not-allowed px-4 py-3 bg-gray-600 rounded"
                    disabled
                  >
                    Bilhetes Indisponíveis
                  </button>
                )}
                <p className="text-xs text-center text-brand-grey mt-2">
                  Verifique sempre os detalhes no site oficial do promotor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
