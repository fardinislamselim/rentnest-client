import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-0 shadow-sm">
      {/* Image Skeleton */}
      <Skeleton className="aspect-[16/10] w-full rounded-none" />

      {/* Content Skeleton */}
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          {/* Location */}
          <Skeleton className="h-3 w-1/3 rounded" />
          {/* Title */}
          <Skeleton className="h-5 w-3/4 rounded" />
          {/* Subtitle / desc */}
          <Skeleton className="h-3 w-full rounded" />
        </div>

        {/* Specs Skeleton */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/50">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
        </div>

        {/* Button Skeleton */}
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
