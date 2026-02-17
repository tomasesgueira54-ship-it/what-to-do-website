export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="h-10 w-64 bg-brand-grey-dark/40 rounded animate-pulse mb-4" />
        <div className="h-5 w-96 max-w-full bg-brand-grey-dark/30 rounded animate-pulse mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="border border-brand-grey-dark rounded-lg overflow-hidden"
            >
              <div className="h-44 bg-brand-grey-dark/30 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-1/2 bg-brand-grey-dark/30 rounded animate-pulse" />
                <div className="h-5 w-3/4 bg-brand-grey-dark/40 rounded animate-pulse" />
                <div className="h-4 w-full bg-brand-grey-dark/30 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
