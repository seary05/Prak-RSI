export default function StallCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white" aria-hidden="true">
      <div className="h-36 animate-pulse bg-brand-100/60" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-brand-100/70" />
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-brand-100/50" />
        <div className="h-3 w-full animate-pulse rounded-full bg-brand-100/50" />
      </div>
    </div>
  );
}