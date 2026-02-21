"use client";
import React from "react";
import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  try {
    console.error(
      "[GlobalError] client render error:",
      error?.message || error,
      "\n",
      error?.stack,
    );
  } catch (e) {
    console.error("[GlobalError] failed to log error client-side", e);
  }

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-brand-red/15 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaExclamationTriangle className="text-4xl text-brand-red" />
        </div>
        <h1 className="font-display text-3xl font-bold text-white mb-3">
          Algo correu mal
        </h1>
        <p className="text-brand-grey-light mb-8 text-lg">
          Ocorreu um erro inesperado. Experimenta recarregar a página.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button onClick={() => reset()} className="btn-primary">
            Tentar novamente
          </button>
          <Link href="/" className="btn-secondary">
            Ir para o início
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="text-left bg-brand-grey-dark/30 rounded-xl p-4 border border-brand-grey-dark/50">
            <summary className="text-brand-grey text-sm cursor-pointer hover:text-white transition-colors">
              Detalhes técnicos (dev)
            </summary>
            <pre className="text-brand-grey text-xs mt-3 whitespace-pre-wrap overflow-auto max-h-60">
              {error?.stack || String(error)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
