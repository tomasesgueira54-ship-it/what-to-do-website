"use client";

interface FloatingToastProps {
  message: string | null;
}

export default function FloatingToast({ message }: FloatingToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-brand-black-light border border-brand-red/40 text-white shadow-[0_0_20px_-6px_rgba(142,13,60,0.55)]"
    >
      {message}
    </div>
  );
}
