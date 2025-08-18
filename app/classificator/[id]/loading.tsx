import { Skeleton } from "@/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
