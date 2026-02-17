"use client";
import React from "react";

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
    <div
      style={{
        padding: 40,
        color: "#fff",
        background: "#111",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#ff6961" }}>Erro no servidor</h1>
      <p>Ocorreu um erro inesperado ao renderizar a página.</p>
      <details style={{ whiteSpace: "pre-wrap", marginTop: 16 }}>
        <summary>Mostrar detalhes (dev)</summary>
        <pre style={{ color: "#eee" }}>{error?.stack || String(error)}</pre>
      </details>
      <div style={{ marginTop: 20 }}>
        <button onClick={() => reset()} className="btn-primary">
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
