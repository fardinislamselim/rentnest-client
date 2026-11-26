import { PropertyGridSkeleton } from "@/components/shared/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function WishlistLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <Skeleton className="h-12 w-64 rounded-xl" />
      <PropertyGridSkeleton count={6} />
    </div>
  );
}
