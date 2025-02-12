import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import { FaFilter } from "react-icons/fa";
import { useEffect, useState } from "react";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "Web Development", label: "Web Development" },
  { value: "Graphic Design", label: "Graphic Design" },
  { value: "Content Writing", label: "Content Writing" },
  { value: "Tech Support", label: "Tech Support" },
];

// Custom styles for react-select to match other inputs
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
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(
    categories.find((c) => c.value === searchParams.get("category")) ||
      categories[0]
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
    setCategory(
      categories.find((c) => c.value === searchParams.get("category")) ||
        categories[0]
    );
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setSortBy(searchParams.get("sortBy") || "newest");
  }, [searchParams]);

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (type === "min") {
      setMinPrice(numericValue);
      numericValue
        ? searchParams.set("minPrice", numericValue)
        : searchParams.delete("minPrice");
    } else {
      setMaxPrice(numericValue);
      numericValue
        ? searchParams.set("maxPrice", numericValue)
        : searchParams.delete("maxPrice");
    }
    setSearchParams(searchParams);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setCategory(categories[0]);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    setSearchParams(new URLSearchParams());
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [searchParams]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-5">
      <div className="flex items-center gap-2 mb-6">
        <FaFilter className="text-[#F4B860]" />
        <h3 className="text-lg font-semibold">Filters</h3>
      </div>

      {/* Search Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Search</label>
        <input
          type="text"
          placeholder="Keyword search..."
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            e.target.value
              ? searchParams.set("q", e.target.value)
              : searchParams.delete("q");
            setSearchParams(searchParams);
          }}
        />
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Category</label>
        <Select
          options={categories}
          value={category}
          onChange={(selected) => {
            setCategory(selected || categories[0]);
            selected?.value === "all"
              ? searchParams.delete("category")
              : searchParams.set("category", selected?.value || "");
            setSearchParams(searchParams);
          }}
          styles={selectStyles}
        />
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Min"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
            value={minPrice}
            onChange={(e) => handlePriceChange("min", e.target.value)}
          />
          <input
            type="text"
            placeholder="Max"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
            value={maxPrice}
            onChange={(e) => handlePriceChange("max", e.target.value)}
          />
        </div>
      </div>

      {/* Sort Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Sort By</label>
        <select
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            searchParams.set("sortBy", e.target.value);
            setSearchParams(searchParams);
          }}
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="w-full cursor-pointer bg-[#F4B860] hover:bg-[#e3a24f] text-white px-6 py-2 rounded-lg transition"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default Filters;
