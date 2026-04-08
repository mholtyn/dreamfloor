import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

type TopBarProps = {
  onInfoClick: () => void;
  globalLineupCount: number | null;
};

export function TopBar({ onInfoClick, globalLineupCount }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 shadow-sm lg:px-8">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold tracking-widest uppercase">
          Dreamfloor
        </span>
      </div>
      <div className="flex items-center gap-3">
        {globalLineupCount !== null && (
          <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-3 py-1">
            <span className="text-sm font-semibold tabular-nums">
              {globalLineupCount.toLocaleString()}
            </span>
            <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              posters created
            </span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={onInfoClick}>
          <Info className="size-4" />
          <span className="sr-only">About Dreamfloor</span>
        </Button>
      </div>
    </header>
  );
}
