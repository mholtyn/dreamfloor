import { useState } from "react";
import { Check, Download, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { incrementLineupCount } from "@/lib/dreamfloorApi";
import { posthog } from "@/lib/posthog";
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

  async function incrementGlobalLineupCountOrNotifyFailure(
    counterUpdateFailureMessage: string,
  ): Promise<void> {
    try {
      const nextGlobalLineupCount = await incrementLineupCount();
      onLineupCountIncremented?.(nextGlobalLineupCount);
    } catch {
      toast.message(counterUpdateFailureMessage);
    }
  }

  async function handleExportPng() {
    setIsExporting(true);
    try {
      const posterBlob = await capturePosterAsBlob();
      if (!posterBlob) {
        toast.error("Failed to capture poster. Try again.");
        return;
      }
      downloadBlob(posterBlob);
      await incrementGlobalLineupCountOrNotifyFailure(
        "PNG exported, but global counter update failed.",
      );
      posthog.capture("poster_exported");
      setExportSucceeded(true);
      toast.success("PNG downloaded.");
      setTimeout(() => setExportSucceeded(false), 3000);
    } catch (exportError) {
      console.error("[ExportActions] export failed:", exportError);
      posthog.captureException(exportError);
      posthog.capture("export_failed", { action: "export_png" });
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
        posthog.capture("poster_shared");
        await incrementGlobalLineupCountOrNotifyFailure(
          "Shared, but global counter update failed.",
        );
        setShareSucceeded(true);
        toast.success("Shared via native share dialog.");
        setTimeout(() => setShareSucceeded(false), 3000);
        return;
      }

      if (shareOutcome === "downloaded_as_fallback") {
        posthog.capture("poster_share_downloaded_as_fallback");
        await incrementGlobalLineupCountOrNotifyFailure(
          "PNG downloaded, but global counter update failed.",
        );
        toast.message("Native share not available. PNG downloaded instead.");
        return;
      }

      toast.error("Share failed. Please try again.");
    } catch (shareError) {
      posthog.captureException(shareError);
      posthog.capture("export_failed", { action: "share" });
      toast.error("Share failed. Please try again.");
    } finally {
      setIsSharing(false);
    }
  }

  const isPosterActionInProgress = isExporting || isSharing;

  return (
    <div className="space-y-2.5 border-t pt-3 sm:pt-4">
      <Button
        className="w-full text-base"
        size="lg"
        disabled={!isLineupValid || isPosterActionInProgress}
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

      <Button
        className="w-full text-sm font-normal text-foreground"
        size="lg"
        variant="outline"
        disabled={!isLineupValid || isPosterActionInProgress}
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

      {!isLineupValid && (
        <p className="text-center text-xs text-muted-foreground">
          Add at least two artists to enable share and export
        </p>
      )}

      <p className="text-center text-[11px] text-muted-foreground">
        Share uses native share when available. Export always downloads PNG.
      </p>
    </div>
  );
}

