import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export function TendersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-40 bg-muted rounded skeleton" />
      </div>

      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <div className="h-6 w-24 bg-muted rounded-full skeleton" />
                  <div className="h-6 w-32 bg-muted rounded-full skeleton" />
                </div>
                <div className="h-6 w-full bg-muted rounded skeleton" />
                <div className="h-6 w-3/4 bg-muted rounded skeleton" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-2 mb-4">
              <div className="h-4 w-full bg-muted rounded skeleton" />
              <div className="h-4 w-2/3 bg-muted rounded skeleton" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-5 bg-muted rounded skeleton" />
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t">
            <div className="flex justify-between w-full">
              <div className="h-5 w-32 bg-muted rounded skeleton" />
              <div className="flex gap-2">
                <div className="h-9 w-24 bg-muted rounded skeleton" />
                <div className="h-9 w-28 bg-muted rounded skeleton" />
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
