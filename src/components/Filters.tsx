import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import { FaFilter, FaTimes } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "Web Development", label: "Web Development" },
  { value: "Graphic Design", label: "Graphic Design" },
  { value: "Content Writing", label: "Content Writing" },
  { value: "Tech Support", label: "Tech Support" },
];

const selectStyles = {
  control: (base: any, { isFocused }: { isFocused: boolean }) => ({
    ...base,
    padding: "6px",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    boxShadow: isFocused ? "0 0 0 2px #F4B860" : "none",
    "&:hover": { borderColor: "#F4B860" },
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: "#999",
    "&:hover": { color: "#F4B860" },
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  }),
  option: (base: any, { isFocused }: { isFocused: boolean }) => ({
    ...base,
    backgroundColor: isFocused ? "#F4B860" : "white",
    color: isFocused ? "white" : "black",
  }),
};

const Filters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // State management
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [category, setCategory] = useState(
    categories.find((c) => c.value === searchParams.get("category")) ||
      categories[0]
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

  // Sync state with URL params
  useEffect(() => {
    setCategory(
      categories.find((c) => c.value === searchParams.get("category")) ||
        categories[0]
    );
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setSortBy(searchParams.get("sortBy") || "newest");
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);

    const params = new URLSearchParams(searchParams);
    e.target.value
      ? params.set("search", e.target.value)
      : params.delete("search");
    setSearchParams(params);

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const params = new URLSearchParams(searchParams);

    if (type === "min") {
      setMinPrice(numericValue);
      numericValue
        ? params.set("minPrice", numericValue)
        : params.delete("minPrice");
    } else {
      setMaxPrice(numericValue);
      numericValue
        ? params.set("maxPrice", numericValue)
        : params.delete("maxPrice");
    }

    setSearchParams(params);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="hidden lg:block sticky top-5">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FaFilter className="text-[#F4B860]" /> Filters
        </h3>

        {/* Search Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Search</label>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Keyword search..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select
            options={categories}
            value={category}
            onChange={(selected) => {
              const params = new URLSearchParams(searchParams);
              selected?.value === "all"
                ? params.delete("category")
                : params.set("category", selected?.value || "");
              setSearchParams(params);
            }}
            styles={selectStyles}
            menuPlacement="auto"
          />
        </div>

        {/* Price Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Price Range ($)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Min"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
              value={minPrice}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              min="0"
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
              value={maxPrice}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              min="0"
            />
          </div>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Sort By</label>
          <select
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
            value={sortBy}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              params.set("sortBy", e.target.value);
              setSearchParams(params);
            }}
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="w-full bg-[#F4B860] hover:bg-[#e3a24f] text-white px-6 py-2 rounded-lg transition"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
