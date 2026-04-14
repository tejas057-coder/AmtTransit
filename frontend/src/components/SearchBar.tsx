import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  variant?: "default" | "expanded";
}

export function SearchBar({
  placeholder = "Search stops or routes",
  onSearch,
  onClear,
  variant = "default",
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setSearchQuery("");
    onClear?.();
  };

  return (
    <div
      className={`relative transition-all ${
        variant === "expanded" && isFocused ? "scale-105" : ""
      }`}
    >
      <Search
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors ${
          isFocused ? "text-primary" : "text-muted-foreground"
        }`}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-card border transition-all rounded-[20px] pl-12 pr-10 py-3.5 focus:outline-none text-foreground placeholder-muted-foreground font-normal ${
          isFocused
            ? "border-primary/50 ring-2 ring-primary/30"
            : "border-white/20 focus:ring-2 focus:ring-primary/50"
        }`}
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted/50 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
      )}
    </div>
  );
}

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  variant?: "default" | "filled";
}

export function FilterChip({ label, active = false, onClick, variant = "default" }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-[20px] font-medium text-sm transition-all ${
        active
          ? "bg-primary text-primary-foreground"
          : variant === "filled"
            ? "bg-muted text-foreground hover:bg-muted/80"
            : "bg-card border border-white/8 text-muted-foreground hover:text-foreground hover:border-white/15"
      }`}
    >
      {label}
    </button>
  );
}
