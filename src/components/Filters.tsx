import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import { FaFilter, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // State management
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(
    categories.find((c) => c.value === searchParams.get("category")) ||
      categories[0]
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync state with URL params
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FaFilter className="text-[#F4B860]" /> Filters
        </h3>
        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Search</label>
        <input
          type="text"
          placeholder="Keyword search..."
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
          value={searchQuery}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams);
            e.target.value
              ? params.set("q", e.target.value)
              : params.delete("q");
            setSearchParams(params);
          }}
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
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
          />
          <input
            type="number"
            placeholder="Max"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F4B860] outline-none"
            value={maxPrice}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            min="0"
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
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
  );

  return (
    <>
      {/* Mobile Trigger */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed bottom-4 right-4 bg-[#F4B860] text-white p-4 rounded-full shadow-lg z-20"
        >
          <FaFilter size={24} />
        </button>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Filters */}
      <div className="hidden lg:block sticky top-5">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filters */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white p-6 z-40 overflow-y-auto shadow-xl"
          >
            <FilterContent />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Filters;
