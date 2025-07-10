import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, X, Check } from "lucide-react";

interface MultiSelectDropdownProps {
  options: string[];
  selectedOptions: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
}

export default function MultiSelectDropdown({
  options,
  selectedOptions,
  onSelectionChange,
  placeholder = "Select options...",
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: string) => {
    if (selectedOptions.includes(option)) {
      onSelectionChange(selectedOptions.filter((item) => item !== option));
    } else {
      onSelectionChange([...selectedOptions, option]);
    }
  };

  const removeOption = (option: string) => {
    onSelectionChange(selectedOptions.filter((item) => item !== option));
  };

  const handleToggleDropdown = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 240; // max-h-60 = 240px

      setOpenUpwards(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
    }
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full p-2 px-4 bg-[#05070a] border border-gray-600/50 rounded-xl text-white cursor-pointer min-h-[40px] flex items-center justify-between focus:border-gray-500 transition-all duration-200"
        onClick={handleToggleDropdown}
      >
        <div className="flex flex-wrap gap-2">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option, index) => (
              <span
                key={index}
                className="bg-gray-600 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1"
              >
                {option}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(option);
                  }}
                  className="text-white hover:text-red-300"
                >
                  <X size={14} />
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp size={20} className="text-gray-400" />
        ) : (
          <ChevronDown size={20} className="text-gray-400" />
        )}
      </div>

      {isOpen && (
        <div
          className={`absolute z-10 w-full ${
            openUpwards ? "bottom-full mb-1" : "top-full mt-1"
          } bg-[#05070a] border border-gray-600/50 rounded-xl shadow-lg max-h-60 overflow-y-auto`}
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={`p-3 cursor-pointer hover:bg-gray-700/50 transition-colors duration-200 ${
                selectedOptions.includes(option)
                  ? "bg-gray-600/50 text-white"
                  : "text-gray-300"
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {selectedOptions.includes(option) && (
                  <Check size={16} className="text-green-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
