import { useState } from "react";
import { Search } from "lucide-react";
import { searchItems } from "../services/searchService";

export default function SearchBar({ onResults }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchItems(query);
      onResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center justify-center gap-2 w-full max-w-lg mx-auto mb-6"
    >
      <input
        type="text"
        placeholder="Search for hotels or dishes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 flex items-center gap-1"
      >
        <Search size={18} />
        {loading ? "..." : "Search"}
      </button>
    </form>
  );
}
