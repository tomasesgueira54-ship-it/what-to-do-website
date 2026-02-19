import { ReactNode } from "react";

export default function PodcastLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-gradient-to-b from-brand-black via-brand-black to-brand-red/5 py-12 md:py-16 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-red/10 via-brand-black/0 to-transparent pointer-events-none" />
      {children}
    </section>
  );
}
