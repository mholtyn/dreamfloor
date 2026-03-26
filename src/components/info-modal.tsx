import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type InfoModalProps = {
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
};

export function InfoModal({ open, onOpenChange }: InfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>About Dreamfloor</DialogTitle>
          <DialogDescription>
            Create fictional techno lineup posters and share them with friends.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm leading-relaxed">
          <section>
            <h3 className="mb-1 font-semibold">What is Dreamfloor?</h3>
            <p className="text-muted-foreground">
              Dreamfloor is a free tool for building fictional techno event posters.
              Pick a visual preset, add your dream lineup, and export a
              high-quality PNG to share anywhere.
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-semibold">How to Use</h3>
            <ol className="list-inside list-decimal space-y-1 text-muted-foreground">
              <li>Choose a poster style from the preset gallery</li>
              <li>Add artists and set durations for each slot</li>
              <li>Preview your poster live on the left</li>
              <li>Export as PNG or share directly</li>
            </ol>
          </section>

          <section>
            <h3 className="mb-1 font-semibold">Disclaimer</h3>
            <p className="text-muted-foreground">
              All lineups created with Dreamfloor are entirely fictional and
              fan-made. This tool is not affiliated with any artist, venue, or
              event organizer. Artist names are used for fan purposes only.
            </p>
          </section>

          <section>
            <h3 className="mb-1 font-semibold">Privacy</h3>
            <p className="text-muted-foreground">
              Your lineup data stays in your browser. Nothing is stored on our
              servers.
            </p>
          </section>
        </div>

        <DialogFooter>
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
