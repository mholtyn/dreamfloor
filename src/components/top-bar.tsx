import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

type TopBarProps = {
  onInfoClick: () => void;
};

export function TopBar({ onInfoClick }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 shadow-sm lg:px-8">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold tracking-widest uppercase">
          Dreamfloor
        </span>
      </div>
      <Button variant="ghost" size="icon" onClick={onInfoClick}>
        <Info className="size-4" />
        <span className="sr-only">About Dreamfloor</span>
      </Button>
    </header>
  );
}
