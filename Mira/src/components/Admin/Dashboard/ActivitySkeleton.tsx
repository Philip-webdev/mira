export default function ActivitySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-10 w-10 rounded-full bg-gray-200" />

          <div className="flex-1 rounded-2xl bg-gray-100 p-4">
            <div className="mb-3 h-4 w-40 rounded bg-gray-200" />
            <div className="mb-3 h-3 w-56 rounded bg-gray-200" />
            <div className="h-3 w-24 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
