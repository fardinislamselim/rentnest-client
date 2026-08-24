import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/components/layout/container";

export default function PropertyDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        <Skeleton className="h-8 w-40 rounded mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Skeleton className="aspect-[16/10] w-full rounded-3xl" />

            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
            </div>

            <Skeleton className="h-24 w-full rounded-2xl" />

            <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-6">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>

            <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-6">
              <Skeleton className="h-5 w-32 rounded" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full rounded" />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4 rounded-3xl border border-border/60 bg-card p-6">
              <Skeleton className="h-6 w-48 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <div className="mt-4 space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-4">
                <Skeleton className="h-3 w-32 rounded" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
