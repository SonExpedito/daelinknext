"use client";
import { Search } from "lucide-react";
import { useState } from "react";
import "./search.css";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
}

export default function SearchBar({
  placeholder = "Busque uma específica",
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // dispara em tempo real
  };

  const handleSearch = () => {
    onSearch(query); // ainda funciona no botão
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center background-primary px-4 py-4 w-full max-w-md barshadow rounded-xl">
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 outline-none text-color placeholder-gray-500"
        value={query}
        onChange={handleInputChange} // agora busca em tempo real
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch} className="ml-2">
        <Search className="text-color w-5 h-5 cursor-pointer" />
      </button>
    </div>
  );
}
