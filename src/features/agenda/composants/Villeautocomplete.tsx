import { useEffect, useRef, useState } from 'react';
import '../style/villeAutocomplete.css';

interface Suggestion {
  id: string;
  label: string;
}

interface VilleAutocompleteProps {
  value: string;
  onChange: (ville: string) => void;
  placeholder?: string;
}

const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;

async function searchVilles(query: string): Promise<Suggestion[]> {
  // On limite aux communes/villes (featuretype=city) au Maroc.
  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&featuretype=city&accept-language=fr&countrycodes=ma&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('Recherche impossible');
  const data = await response.json();
  return (data as any[]).map((item) => ({
    id: item.place_id,
    label: item.display_name as string,
  }));
}

export default function VilleAutocomplete({ value, onChange, placeholder }: VilleAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleInputChange(text: string) {
    setInputValue(text);
    onChange(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.trim().length < MIN_CHARS) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchVilles(text.trim());
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
  }

  function handleSelect(suggestion: Suggestion) {
    setInputValue(suggestion.label);
    onChange(suggestion.label);
    setIsOpen(false);
    setSuggestions([]);
  }

  return (
    <div className="ville-autocomplete" ref={containerRef}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        placeholder={placeholder ?? 'Ex. Casablanca'}
        autoComplete="off"
      />
      {loading && <span className="ville-autocomplete-loading">Recherche…</span>}

      {isOpen && suggestions.length > 0 && (
        <ul className="ville-autocomplete-suggestions">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button type="button" onClick={() => handleSelect(s)}>
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}