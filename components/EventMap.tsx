"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Event } from "@/data/types";
import Link from "next/link";
import { getDisplayLocation } from "@/lib/event-display";

// Fix for default marker icon in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface EventMapProps {
  events: Event[];
  locale: string;
}

const LISBON_CENTER: [number, number] = [38.7223, -9.1393];

export default function EventMap({ events, locale }: EventMapProps) {
  // Filter events with coordinates
  const mapEvents = events.filter((ev) => ev.lat && ev.lng);

  if (mapEvents.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-brand-black-light text-brand-grey text-center p-8">
        <span className="text-4xl mb-4">🗺️</span>
        <p className="text-lg font-bold text-white mb-2">
          {locale === "pt" ? "Sem eventos no mapa" : "No events on the map"}
        </p>
        <p className="max-w-md">
          {locale === "pt"
            ? "Nenhum dos eventos filtrados tem localização detalhada disponível neste momento."
            : "None of the filtered events have detailed location data available at the moment."}
        </p>
      </div>
    );
  }

  return (
    <MapContainer
      center={LISBON_CENTER}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mapEvents.map((ev) => (
        <Marker key={ev.id} position={[ev.lat!, ev.lng!]}>
          <Popup>
            <div className="text-sm">
              <h3 className="font-bold text-gray-900">{ev.title}</h3>
              <p className="text-gray-600 mb-2">
                {getDisplayLocation(
                  ev.location,
                  ev.description,
                  locale === "pt",
                )}
              </p>
              <p className="text-indigo-600 font-semibold mb-2">
                {ev.date.split("T")[0]}
              </p>
              <Link
                href={`/${locale}/events/${ev.id}`}
                className="block text-center bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
              >
                {locale === "pt" ? "Ver Detalhes" : "See Details"}
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
