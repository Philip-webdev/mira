export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-[320px] rounded-3xl bg-gray-200" />

      <div className="grid lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 rounded-3xl bg-gray-200" />
        ))}
      </div>

      <div className="h-[500px] rounded-3xl bg-gray-200" />
    </div>
  );
}
