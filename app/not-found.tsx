import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <span className="font-display text-[8rem] sm:text-[10rem] font-black text-brand-red/10 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-5xl sm:text-6xl font-bold text-white">
              404
            </span>
          </div>
        </div>

        <h1 className="font-display text-2xl font-bold text-white mb-3">
          Página não encontrada
        </h1>
        <p className="text-brand-grey-light mb-8 text-lg max-w-md mx-auto">
          A página que procuras não existe ou foi movida. Descobre o que há para
          fazer em Lisboa!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Ir para o início
          </Link>
          <Link href="/events" className="btn-secondary">
            Ver eventos
          </Link>
        </div>
      </div>
    </div>
  );
}
