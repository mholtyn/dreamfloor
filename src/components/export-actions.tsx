import { useState } from "react";
import { Check, Download, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { incrementLineupCount } from "@/lib/dreamfloorApi";
import {
  capturePosterAsBlob,
  downloadBlob,
  sharePosterBlob,
} from "@/utils/export-poster";

type ExportActionsProps = {
  isLineupValid: boolean;
  onLineupCountIncremented?: (nextLineupCount: number) => void;
};

export function ExportActions({
  isLineupValid,
  onLineupCountIncremented,
}: ExportActionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [exportSucceeded, setExportSucceeded] = useState(false);
  const [shareSucceeded, setShareSucceeded] = useState(false);

  async function handleExportPng() {
    setIsExporting(true);
    try {
      const posterBlob = await capturePosterAsBlob();
      if (!posterBlob) {
        toast.error("Failed to capture poster. Try again.");
        return;
      }
      downloadBlob(posterBlob);
      try {
        const incrementedLineupCount = await incrementLineupCount();
        onLineupCountIncremented?.(incrementedLineupCount);
      } catch {
        toast.message("PNG exported, but global counter update failed.");
      }
      setExportSucceeded(true);
      toast.success("PNG downloaded.");
      setTimeout(() => setExportSucceeded(false), 3000);
    } catch (exportError) {
      console.error("[ExportActions] export failed:", exportError);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleShare() {
    setIsSharing(true);
    try {
      const posterBlob = await capturePosterAsBlob();
      if (!posterBlob) {
        toast.error("Failed to capture poster. Try again.");
        return;
      }

      const shareOutcome = await sharePosterBlob(posterBlob);
      if (shareOutcome === "shared_via_native_dialog") {
        setShareSucceeded(true);
        toast.success("Shared via native share dialog.");
        setTimeout(() => setShareSucceeded(false), 3000);
        return;
      }

      if (shareOutcome === "downloaded_as_fallback") {
        toast.message("Native share not available. PNG downloaded instead.");
        return;
      }

      toast.error("Share failed. Please try again.");
    } catch {
      toast.error("Share failed. Please try again.");
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <div className="space-y-2.5 border-t pt-3 sm:pt-4">
      <Button
        className="w-full"
        size="lg"
        disabled={!isLineupValid || isExporting}
        onClick={handleExportPng}
      >
        {isExporting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : exportSucceeded ? (
          <Check className="size-4" />
        ) : (
          <Download className="size-4" />
        )}
        {isExporting ? "Exporting..." : exportSucceeded ? "Exported!" : "Export PNG"}
      </Button>

      <Button
        className="w-full"
        size="lg"
        variant="outline"
        disabled={!isLineupValid || isSharing}
        onClick={handleShare}
      >
        {isSharing ? (
          <Loader2 className="size-4 animate-spin" />
        ) : shareSucceeded ? (
          <Check className="size-4" />
        ) : (
          <Share2 className="size-4" />
        )}
        {isSharing ? "Sharing..." : shareSucceeded ? "Shared!" : "Share"}
      </Button>

      {!isLineupValid && (
        <p className="text-center text-xs text-muted-foreground">
          Add at least two artists to enable export
        </p>
      )}

      <p className="text-center text-[11px] text-muted-foreground">
        Export always downloads PNG. Share uses native share when available.
      </p>
    </div>
  );
}

