import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { TECHNO_ARTISTS } from "@/data/artists";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_SUGGESTIONS = 6;

type ArtistAutocompleteProps = {
  value: string;
  onChangeArtistName: (nextArtistName: string) => void;
  placeholder?: string;
};

export function ArtistAutocomplete({
  value,
  onChangeArtistName,
  placeholder = "Enter artist name",
}: ArtistAutocompleteProps) {
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const normalizedInputValue = value.toLowerCase().trim();
  const filteredSuggestions =
    normalizedInputValue.length > 0
      ? TECHNO_ARTISTS.filter((artistName) =>
          artistName.toLowerCase().includes(normalizedInputValue),
        ).slice(0, MAX_VISIBLE_SUGGESTIONS)
      : [];

  function handleFocus() {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsSuggestionsOpen(true);
  }

  function handleBlur() {
    blurTimeoutRef.current = setTimeout(() => {
      setIsSuggestionsOpen(false);
    }, 200);
  }

  function handleSelectSuggestion(artistName: string) {
    onChangeArtistName(artistName);
    setIsSuggestionsOpen(false);
  }

  const shouldShowSuggestions =
    isSuggestionsOpen && filteredSuggestions.length > 0;

  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={(event) => onChangeArtistName(event.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full"
        autoComplete="off"
      />

      {shouldShowSuggestions && (
        <ul className="absolute top-full right-0 left-0 z-30 mt-1 max-h-48 overflow-auto rounded-lg border bg-popover shadow-lg">
          {filteredSuggestions.map((artistName) => (
            <li key={artistName}>
              <button
                type="button"
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-accent",
                  artistName.toLowerCase() === normalizedInputValue &&
                    "bg-accent font-medium",
                )}
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSelectSuggestion(artistName);
                }}
              >
                {artistName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
