import { useState } from "react";
import { Download, Share2, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  capturePosterAsBlob,
  downloadBlob,
  sharePosterBlob,
} from "@/utils/export-poster";

type ExportActionsProps = {
  isLineupValid: boolean;
};

export function ExportActions({ isLineupValid }: ExportActionsProps) {
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
      setExportSucceeded(true);
      toast.success("Poster exported!");
      setTimeout(() => setExportSucceeded(false), 3000);
    } catch {
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
      const didShare = await sharePosterBlob(posterBlob);
      if (didShare) {
        setShareSucceeded(true);
        toast.success("Shared successfully!");
        setTimeout(() => setShareSucceeded(false), 3000);
      } else {
        toast.error("Could not share. Link copied to clipboard instead.");
      }
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
        {isExporting
          ? "Exporting..."
          : exportSucceeded
            ? "Exported!"
            : "Export PNG"}
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
          Add at least one artist to enable export
        </p>
      )}
    </div>
  );
}
