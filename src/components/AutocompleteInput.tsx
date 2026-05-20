import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  companyId: string;
  rpcName: 'search_patentes' | 'search_marcas';
  placeholder?: string;
  className?: string;
  required?: boolean;
  label?: string;
}

interface PatenteResult {
  plate: string;
  brand: string;
  model: string;
}

export function AutocompleteInput({
  value,
  onChange,
  companyId,
  rpcName,
  placeholder,
  className = '',
  required,
}: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [details, setDetails] = useState<Map<string, string>>(new Map());
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (term: string) => {
    if (!term || term.length < 1) {
      setSuggestions([]);
      setDetails(new Map());
      setIsOpen(false);
      return;
    }

    const { data } = await supabase.rpc(rpcName, {
      org_id: companyId,
      term,
    });

    if (data && Array.isArray(data)) {
      if (rpcName === 'search_patentes') {
        const items = data as PatenteResult[];
        setSuggestions(items.map(i => i.plate));
        const detailMap = new Map<string, string>();
        items.forEach(i => detailMap.set(i.plate, `${i.brand} ${i.model}`));
        setDetails(detailMap);
      } else {
        const items = data as { brand: string }[];
        setSuggestions(items.map(i => i.brand));
        setDetails(new Map());
      }
      setIsOpen(true);
      setHighlightedIndex(-1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 200);
  };

  const handleSelect = (item: string) => {
    onChange(item);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
        placeholder={placeholder}
        className={className}
        required={required}
        autoComplete="off"
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((item, index) => (
            <li
              key={item}
              onClick={() => handleSelect(item)}
              className={`px-3 py-2 cursor-pointer text-sm ${
                index === highlightedIndex
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">{item}</span>
              {details.get(item) && (
                <span className="ml-2 text-gray-400">{details.get(item)}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
