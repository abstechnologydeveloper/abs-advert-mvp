import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, X, CheckSquare, Square, Loader2, ChevronRight } from "lucide-react";

interface Option {
  id: string;
  label: string;
}

interface MultiSelectDropdownProps {
  label: string;
  icon?: React.ReactNode;
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  tagColor?: "blue" | "green" | "purple" | "red" | "yellow";
  isLoading?: boolean;
  helperText?: string;
  getDisplayName?: (id: string) => string;
}

const colorClasses = {
  blue: {
    tag: "bg-blue-100 text-blue-800",
    hover: "hover:bg-blue-200",
  },
  green: {
    tag: "bg-green-100 text-green-800",
    hover: "hover:bg-green-200",
  },
  purple: {
    tag: "bg-purple-100 text-purple-800",
    hover: "hover:bg-purple-200",
  },
  red: {
    tag: "bg-red-100 text-red-800",
    hover: "hover:bg-red-200",
  },
  yellow: {
    tag: "bg-yellow-100 text-yellow-800",
    hover: "hover:bg-yellow-200",
  },
};

const ITEMS_PER_PAGE = 50;
const MAX_VISIBLE_TAGS = 5;

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  icon,
  options,
  selectedValues,
  onChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  tagColor = "blue",
  isLoading = false,
  helperText,
  getDisplayName,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [showAllTags, setShowAllTags] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position
  useEffect(() => {
    if (showDropdown && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;

      setDropdownPosition({
        top: rect.bottom + scrollY + 4,
        left: rect.left + scrollX,
        width: rect.width,
      });
    }
  }, [showDropdown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setSearchQuery("");
        setDisplayCount(ITEMS_PER_PAGE);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showDropdown) {
        setShowDropdown(false);
        setSearchQuery("");
        setDisplayCount(ITEMS_PER_PAGE);
        triggerRef.current?.focus();
      }
    };

    if (showDropdown) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [showDropdown]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (showDropdown && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;

        setDropdownPosition({
          top: rect.bottom + scrollY + 4,
          left: rect.left + scrollX,
          width: rect.width,
        });
      }
    };

    if (showDropdown) {
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleResize, true);
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleResize, true);
      };
    }
  }, [showDropdown]);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const search = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(search));
  }, [options, searchQuery]);

  // Paginated options
  const displayedOptions = useMemo(() => {
    return filteredOptions.slice(0, displayCount);
  }, [filteredOptions, displayCount]);

  const hasMore = filteredOptions.length > displayCount;
  const remainingCount = filteredOptions.length - displayCount;

  const toggleOption = (id: string) => {
    const updated = selectedValues.includes(id)
      ? selectedValues.filter((v) => v !== id)
      : [...selectedValues, id];
    onChange(updated);
  };

  const selectAll = () => {
    const allIds = filteredOptions.map((opt) => opt.id);
    const newSelections = [...new Set([...selectedValues, ...allIds])];
    onChange(newSelections);
  };

  const clearAll = () => {
    onChange([]);
  };

  const removeItem = (id: string) => {
    onChange(selectedValues.filter((v) => v !== id));
  };

  const getDisplayLabel = (id: string) => {
    if (getDisplayName) {
      return getDisplayName(id);
    }
    return options.find((opt) => opt.id === id)?.label || id;
  };

  const loadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
    setSearchQuery("");
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const colors = colorClasses[tagColor];

  // Display tags with "show more" option
  const visibleTags = showAllTags ? selectedValues : selectedValues.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagsCount = selectedValues.length - MAX_VISIBLE_TAGS;

  // Dropdown content
  const dropdownContent = showDropdown && (
    <div
      ref={dropdownRef}
      className="fixed bg-white border border-gray-300 rounded-lg shadow-2xl overflow-hidden z-[9999]"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: window.innerWidth < 640 ? `calc(100vw - 32px)` : `${dropdownPosition.width}px`,
        maxWidth: window.innerWidth < 640 ? "calc(100vw - 32px)" : "500px",
      }}
    >
      {/* Header with Close Button */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
        <span className="text-xs font-semibold text-gray-700">
          {options.length > 0 ? `${options.length} total items` : "No items"}
        </span>
        <button
          onClick={closeDropdown}
          type="button"
          className="p-1 hover:bg-gray-200 rounded transition"
          title="Close"
        >
          <X size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-2 border-b border-gray-200">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDisplayCount(ITEMS_PER_PAGE);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            autoFocus
          />
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
        <span className="text-xs text-gray-600">
          {filteredOptions.length > 0
            ? `${filteredOptions.length} ${searchQuery ? "found" : "item(s)"}`
            : "No matches"}
        </span>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            type="button"
            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition disabled:opacity-50"
            disabled={filteredOptions.length === 0}
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            type="button"
            className="text-xs text-red-600 hover:text-red-700 font-medium transition disabled:opacity-50"
            disabled={selectedValues.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Options List */}
      <div className="max-h-[50vh] sm:max-h-80 overflow-y-auto">
        {filteredOptions.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <div className="text-gray-400 mb-2">
              <Search size={32} className="mx-auto" />
            </div>
            <p className="text-xs text-gray-500">
              {searchQuery ? "No items match your search" : "No items available"}
            </p>
          </div>
        ) : (
          <>
            {displayedOptions.map((option) => {
              const isSelected = selectedValues.includes(option.id);
              return (
                <label
                  key={option.id}
                  className="flex items-center px-3 py-2.5 hover:bg-blue-50 cursor-pointer transition group"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    {isSelected ? (
                      <CheckSquare size={16} className="text-blue-600 flex-shrink-0 mr-2" />
                    ) : (
                      <Square
                        size={16}
                        className="text-gray-400 group-hover:text-gray-600 flex-shrink-0 mr-2 transition"
                      />
                    )}
                    <span className="text-xs text-gray-900 truncate">{option.label}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOption(option.id)}
                    className="sr-only"
                  />
                </label>
              );
            })}

            {/* Load More Button */}
            {hasMore && (
              <div className="border-t border-gray-200 p-2 bg-gray-50">
                <button
                  onClick={loadMore}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                >
                  <span>Load {Math.min(remainingCount, ITEMS_PER_PAGE)} more</span>
                  <ChevronRight size={14} />
                </button>
                <p className="text-center text-xs text-gray-500 mt-1">
                  Showing {displayedOptions.length} of {filteredOptions.length}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-2 bg-gray-50 flex gap-2">
        <button
          onClick={closeDropdown}
          type="button"
          className="flex-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition"
        >
          Done ({selectedValues.length} selected)
        </button>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative">
      {/* Label */}
      <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
        {helperText && <span className="ml-2 text-xs text-blue-600">({helperText})</span>}
        {isLoading && <Loader2 size={12} className="ml-2 animate-spin" />}
      </label>

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isLoading}
        className="w-full px-3 py-2 text-sm text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white hover:bg-gray-50 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <span className="truncate text-gray-500">
          {selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 ml-2 transition-transform ${showDropdown ? "rotate-180" : ""}`}
        />
      </button>

      {/* Selected Items as Tags */}
      {selectedValues.length > 0 && (
        <div className="mt-2">
          <div className="flex flex-wrap gap-1.5">
            {visibleTags.map((id) => (
              <span
                key={id}
                className={`inline-flex items-center gap-1 px-2 py-1 ${colors.tag} rounded-md text-xs`}
              >
                <span className="max-w-[150px] truncate">{getDisplayLabel(id)}</span>
                <button
                  onClick={() => removeItem(id)}
                  className={`${colors.hover} rounded-full p-0.5 transition`}
                  type="button"
                  title="Remove"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {!showAllTags && hiddenTagsCount > 0 && (
              <button
                onClick={() => setShowAllTags(true)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-xs font-medium transition"
                type="button"
              >
                +{hiddenTagsCount} more
              </button>
            )}
            {showAllTags && selectedValues.length > MAX_VISIBLE_TAGS && (
              <button
                onClick={() => setShowAllTags(false)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-xs font-medium transition"
                type="button"
              >
                Show less
              </button>
            )}
          </div>
        </div>
      )}

      {/* Render dropdown in portal */}
      {typeof document !== "undefined" && createPortal(dropdownContent, document.body)}
    </div>
  );
};
