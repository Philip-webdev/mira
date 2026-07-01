export default function TransactionSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="
          animate-pulse
          rounded-2xl
          border
          p-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gray-200" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-gray-200" />
              <div className="h-3 w-24 rounded bg-gray-100" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="h-3 w-16 rounded bg-gray-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
