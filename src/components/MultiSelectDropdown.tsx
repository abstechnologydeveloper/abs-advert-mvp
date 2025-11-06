import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, X, CheckSquare, Square, Loader2, Filter } from "lucide-react";

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

const ITEMS_PER_PAGE = 100;
const MAX_VISIBLE_TAGS = 2;

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
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [showAllTags, setShowAllTags] = useState(false);
  const [tempSelectedValues, setTempSelectedValues] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when modal opens
  useEffect(() => {
    if (showModal && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [showModal]);

  // Initialize temp selection when modal opens
  useEffect(() => {
    if (showModal) {
      setTempSelectedValues([...selectedValues]);
      setSearchQuery("");
      setDisplayCount(ITEMS_PER_PAGE);
    }
  }, [showModal, selectedValues]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }
  }, [showModal]);

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
    const updated = tempSelectedValues.includes(id)
      ? tempSelectedValues.filter((v) => v !== id)
      : [...tempSelectedValues, id];
    setTempSelectedValues(updated);
  };

  const selectAll = () => {
    const allIds = filteredOptions.map((opt) => opt.id);
    const newSelections = [...new Set([...tempSelectedValues, ...allIds])];
    setTempSelectedValues(newSelections);
  };

  const clearAll = () => {
    setTempSelectedValues([]);
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

  const handleApply = () => {
    onChange(tempSelectedValues);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const colors = colorClasses[tagColor];

  // Display tags with "show more" option
  const visibleTags = showAllTags ? selectedValues : selectedValues.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagsCount = selectedValues.length - MAX_VISIBLE_TAGS;

  // Modal content
  const modalContent = showModal && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            {icon && <div className="text-blue-600">{icon}</div>}
            <div>
              <h3 className="text-lg font-bold text-gray-900">{label}</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {tempSelectedValues.length} of {options.length} selected
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            type="button"
            className="p-2 hover:bg-white/50 rounded-lg transition"
            title="Close"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayCount(ITEMS_PER_PAGE);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-500" />
            <span className="text-sm text-gray-600">
              {filteredOptions.length > 0
                ? `${filteredOptions.length} ${searchQuery ? "found" : "available"}`
                : "No matches"}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={selectAll}
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition disabled:opacity-50"
              disabled={filteredOptions.length === 0}
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              type="button"
              className="text-sm text-red-600 hover:text-red-700 font-medium transition disabled:opacity-50"
              disabled={tempSelectedValues.length === 0}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Options List */}
        <div className="flex-1 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="text-gray-300 mb-4">
                <Search size={48} />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No items found</p>
              <p className="text-xs text-gray-500 text-center max-w-sm">
                {searchQuery
                  ? `No items match "${searchQuery}". Try a different search term.`
                  : "No items available to select."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {displayedOptions.map((option) => {
                const isSelected = tempSelectedValues.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className="flex items-center px-4 sm:px-6 py-3 hover:bg-blue-50 cursor-pointer transition group"
                  >
                    <div className="flex items-center flex-1 min-w-0 gap-3">
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <CheckSquare size={20} className="text-blue-600" />
                        ) : (
                          <Square
                            size={20}
                            className="text-gray-400 group-hover:text-gray-600 transition"
                          />
                        )}
                      </div>
                      <span className="text-sm text-gray-900 truncate font-medium">
                        {option.label}
                      </span>
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
                <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={loadMore}
                    type="button"
                    className="w-full px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition"
                  >
                    Load {Math.min(remainingCount, ITEMS_PER_PAGE)} more items
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Showing {displayedOptions.length} of {filteredOptions.length}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button
            onClick={handleCancel}
            type="button"
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            type="button"
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
          >
            Apply ({tempSelectedValues.length} selected)
          </button>
        </div>
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
        type="button"
        onClick={() => setShowModal(true)}
        disabled={isLoading}
        className="w-full px-3 py-2 text-sm text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white hover:bg-gray-50 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <span className="truncate text-gray-500">
          {selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder}
        </span>
        <ChevronDown size={16} className="flex-shrink-0 ml-2 text-gray-400" />
      </button>

      {/* Selected Items as Tags */}
      {selectedValues.length > 0 && (
        <div className="mt-2">
          <div className="flex flex-wrap gap-1.5">
            {visibleTags.map((id) => (
              <span
                key={id}
                className={`inline-flex items-center gap-1 px-2 py-1 ${colors.tag} rounded-md text-xs font-medium`}
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

      {/* Render modal in portal */}
      {typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </div>
  );
};
