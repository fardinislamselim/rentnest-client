import Container from "@/components/layout/container";
import { PropertyGridSkeleton } from "@/components/shared/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertiesLoading() {
  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-3">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-5 w-96 max-w-full rounded-lg" />
        </div>

        <Skeleton className="mb-8 h-28 w-full rounded-2xl" />

        <PropertyGridSkeleton count={6} />
      </Container>
    </div>
  );
}
