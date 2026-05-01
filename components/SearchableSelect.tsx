"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

type Option = {
  id?: string;
  name: string;
};

type Props = {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  showOthers?: boolean;
};

const SearchableSelect = ({ options, value, onChange, placeholder = "Select...", className = "", showOthers = true }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayValue = value || placeholder;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-200 bg-white px-4 py-3 text-sm flex items-center justify-between cursor-pointer rounded-lg shadow-sm hover:border-indigo-400 transition-all focus:ring-2 focus:ring-indigo-500"
      >
        <span className={`truncate ${!value ? "text-gray-400" : "text-gray-900 font-medium"}`}>
          {displayValue}
        </span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
            <Search className="text-gray-400 shrink-0" size={14} />
            <input
              autoFocus
              type="text"
              className="w-full bg-transparent outline-none text-sm py-1"
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="max-h-[250px] overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onChange(opt.name);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className="px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                >
                  {opt.name}
                </div>
              ))
            ) : (
              <div className="px-4 py-4 text-sm text-gray-400 italic text-center">No categories found</div>
            )}

            {showOthers && !filteredOptions.some(o => o.name === 'Others') && (
              <div
                onClick={() => {
                  onChange("Others");
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className="px-4 py-3 text-sm font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 cursor-pointer border-t border-gray-100 transition-colors"
              >
                + Add Others
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
