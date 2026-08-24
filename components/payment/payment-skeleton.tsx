import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PaymentSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
        <Skeleton className="h-5 w-40 rounded" />
        <Skeleton className="h-8 w-64 rounded mt-2" />
        <Skeleton className="h-4 w-96 rounded mt-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="border-border/60">
            <CardHeader>
              <Skeleton className="h-5 w-48 rounded" />
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-5">
                <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-6 w-1/2 rounded" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full rounded" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <Skeleton className="h-5 w-36 rounded" />
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full rounded" />
                ))}
              </div>
              <Skeleton className="h-4 w-1/3 rounded" />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border-border/60">
            <CardHeader>
              <Skeleton className="h-5 w-40 rounded" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between py-3 border-b border-border/40">
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/40">
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/40">
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-6 w-24 rounded" />
              </div>
            </CardContent>
          </Card>
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
