import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface BookSkeletonProps {
  viewMode: 'grid' | 'list';
}

export function BookSkeleton({ viewMode }: BookSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <Card className="w-full overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-3">
              <div className="h-5 w-2/3 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <div className="h-5 w-full bg-muted rounded animate-pulse"></div>
            <div className="h-5 w-2/3 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-6 w-20 ml-2 bg-muted rounded animate-pulse shrink-0"></div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-3/5 bg-muted rounded animate-pulse"></div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-4 w-28 bg-muted rounded animate-pulse"></div>
      </CardFooter>
    </Card>
  );
} 