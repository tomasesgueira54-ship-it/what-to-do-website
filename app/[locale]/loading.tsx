export default function LoadingLocalePage() {
  return (
    <div className="min-h-screen bg-brand-black text-white">
      {/* Hero skeleton */}
      <div className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="h-8 w-40 shimmer rounded-full mx-auto mb-6" />
          <div className="h-12 w-80 max-w-full shimmer rounded-lg mx-auto mb-4" />
          <div className="h-6 w-96 max-w-full shimmer rounded-lg mx-auto mb-10" />
          <div className="flex justify-center gap-4">
            <div className="h-12 w-40 shimmer rounded-lg" />
            <div className="h-12 w-40 shimmer rounded-lg" />
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="h-8 w-56 shimmer rounded-lg mb-2" />
        <div className="h-5 w-80 max-w-full shimmer rounded-lg mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-brand-black-light border border-brand-grey-dark/20 rounded-xl overflow-hidden"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="aspect-[4/3] shimmer" />
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 shimmer rounded-lg" />
                  <div className="flex-1">
                    <div className="h-3 w-16 shimmer rounded mb-1.5" />
                    <div className="h-4 w-20 shimmer rounded" />
                  </div>
                </div>
                <div className="h-5 w-3/4 shimmer rounded" />
                <div className="h-4 w-full shimmer rounded" />
                <div className="h-4 w-2/3 shimmer rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
