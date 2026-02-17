import { FaSearch } from "react-icons/fa";
import fs from "fs/promises";
import path from "path";
import { Event } from "@/data/types";
import EventsClient from "./EventsClient";

async function getEvents(): Promise<Event[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "events.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const events: Event[] = JSON.parse(fileContent);
    return dedupeEvents(events)
      .filter(isUpcoming)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error("Failed to read events.json", error);
    return [];
  }
}

function isUpcoming(event: Event): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOrStart = event.endDate ? new Date(event.endDate) : new Date(event.date);
  return endOrStart >= today;
}

function dedupeEvents(events: Event[]): Event[] {
  const seen = new Set<string>();
  const result: Event[] = [];

  for (const ev of events) {
    const key = (ev.url || "") || `${ev.title}-${ev.date}`;
    const altKey = `${ev.title}-${ev.date}`;
    if (seen.has(key) || seen.has(altKey)) continue;
    seen.add(key);
    seen.add(altKey);
    result.push(ev);
  }

  return result;
}

export default async function EventsPage() {
  const events = await getEvents();
  const totalEvents = events.length;

  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-brand-red selection:text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4 md:px-8 border-b border-brand-grey-dark/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-red/20 via-brand-black to-brand-black pointer-events-none" />

        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-display font-black mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-brand-grey">
              Agenda{" "}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-red to-red-600 drop-shadow-sm">
              Cultural
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-brand-grey text-lg md:text-xl mb-12 font-light leading-relaxed">
            Os melhores eventos, concertos, exposições e festas em Lisboa para
            esta semana.
          </p>

          <div className="relative group inline-flex flex-col items-center justify-center p-8 bg-brand-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_-20px_rgba(142,13,60,0.3)] hover:shadow-[0_0_80px_-10px_rgba(142,13,60,0.6)] hover:border-brand-red/50 hover:scale-105 transition-all duration-500 ease-out">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/20 via-transparent to-brand-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>

            <p className="relative z-10 text-sm md:text-base text-brand-grey-light uppercase tracking-[0.25em] font-bold mb-2 group-hover:text-white transition-colors duration-300">
              Total de eventos
            </p>
            <p className="relative z-10 text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-brand-grey group-hover:to-white drop-shadow-2xl tabular-nums tracking-tighter transition-all duration-300 transform group-hover:scale-110">
              {totalEvents}
            </p>
          </div>

          {/* Search - simplified for now as this is a Server Component */}
          <div className="max-w-xl mx-auto flex items-center bg-brand-black border border-brand-grey-dark rounded-full px-6 py-4 shadow-lg focus-within:ring-2 focus-within:ring-brand-red opacity-50 cursor-not-allowed hidden">
            <FaSearch className="text-brand-grey mr-4" />
            <input
              type="text"
              placeholder="Pesquisar eventos (Em breve)"
              disabled
              className="flex-1 bg-transparent text-white outline-none placeholder-brand-grey-dark cursor-not-allowed"
            />
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <EventsClient events={events} />
        </div>
      </section>
    </div>
  );
}
