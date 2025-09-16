"use client";
import { Search } from "lucide-react";
import { useState } from "react";


interface SearchBarProps {
  readonly placeholder?: string;
  readonly onSearch: (value: string) => void;
}

export default function SearchBar({
  placeholder = "Busque uma específica",
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div
      className="
        flex items-center px-4 py-3 w-full max-w-md
        rounded-2xl border border-white/30
        bg-white/10 backdrop-blur-xl shadow-lg
        hover:bg-white/20 transition duration-300
      "
    >
      <input
        type="text"
        placeholder={placeholder}
        className="
          flex-1 bg-transparent outline-none
          text-color
        "
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSearch}
        className="
          ml-2 p-2 rounded-full
          bg-white/20 hover:bg-white/30
          transition duration-300
        "
      >
        <Search className="text-color w-5 h-5 cursor-pointer" />
      </button>
    </div>
  );
}
