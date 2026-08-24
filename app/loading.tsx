import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/components/layout/container";

export default function GlobalLoading() {
  return (
    <Container className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-6 py-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
        <Skeleton className="h-8 w-8 animate-pulse rounded" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <Skeleton className="h-6 w-48 rounded" />
        <Skeleton className="h-4 w-64 rounded" />
      </div>
    </Container>
  );
}
