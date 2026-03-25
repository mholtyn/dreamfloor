import { useEffect, useMemo, useState } from 'react';
import { normalizedArtistNamesLowercase } from '../data/artists';

import './autocompleteArtistInput.css';

type AutocompleteArtistInputProps = {
  value: string;
  onChangeArtistName: (nextArtistName: string) => void;
  placeholder?: string;
  inputLabel: string;
};

export function AutocompleteArtistInput({
  value,
  onChangeArtistName,
  placeholder,
  inputLabel,
}: AutocompleteArtistInputProps) {
  const [queryText, setQueryText] = useState(value);
  const [isSuggestionListOpen, setIsSuggestionListOpen] = useState(false);

  useEffect(() => {
    setQueryText(value);
  }, [value]);

  const suggestions = useMemo(() => {
    const trimmedQueryText = queryText.trim().toLowerCase();
    if (!trimmedQueryText) {
      return [];
    }
    const matched = normalizedArtistNamesLowercase
      .filter((record) => record.searchKey.includes(trimmedQueryText))
      .slice(0, 8)
      .map((record) => record.artistName);
    return matched;
  }, [queryText]);

  return (
    <div className="artistInputRoot">
      <label className="artistInputLabel">
        <span className="artistInputLabelText">{inputLabel}</span>
      </label>

      <div className="artistInputControl">
        <input
          className="artistInputField"
          value={queryText}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(event) => {
            setQueryText(event.target.value);
            setIsSuggestionListOpen(true);
          }}
          onFocus={() => setIsSuggestionListOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setIsSuggestionListOpen(false), 120);
          }}
        />

        {isSuggestionListOpen && suggestions.length > 0 ? (
          <ul className="artistSuggestionList" role="listbox" aria-label="Artist suggestions">
            {suggestions.map((suggestionArtistName) => (
              <li key={suggestionArtistName} className="artistSuggestionListItem">
                <button
                  type="button"
                  className="artistSuggestionButton"
                  onMouseDown={() => {
                    onChangeArtistName(suggestionArtistName);
                    setQueryText(suggestionArtistName);
                    setIsSuggestionListOpen(false);
                  }}
                >
                  {suggestionArtistName}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

