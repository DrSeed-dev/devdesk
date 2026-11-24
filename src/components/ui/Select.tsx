import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type SelectProps<T extends string> = {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  className?: string;
};

// Matches the h-9 option rows and p-1 padding used below.
const OPTION_HEIGHT = 36;
const MENU_PADDING = 10;
const MENU_GAP = 4;
const MIN_MENU_WIDTH = 168;

type MenuPosition = {
  top: number;
  left: number;
  width: number;
};

// A styled dropdown that replaces the browser's built-in <select>.
// The menu is drawn on top of the page (a "portal"), so a panel with
// overflow hidden can never cut it off. Fully usable with the keyboard.
function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  className = "",
}: SelectProps<T>) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState<MenuPosition | null>(null);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const selectedOption = options[selectedIndex];

  function openMenu() {
    const button = buttonRef.current;

    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();
    const menuHeight = options.length * OPTION_HEIGHT + MENU_PADDING;
    const spaceBelow = window.innerHeight - rect.bottom;
    const opensUpward = spaceBelow < menuHeight + MENU_GAP && rect.top > spaceBelow;
    const width = Math.max(rect.width, MIN_MENU_WIDTH);

    setPosition({
      top: opensUpward ? rect.top - menuHeight - MENU_GAP : rect.bottom + MENU_GAP,
      left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
      width,
    });
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  }

  function selectIndex(index: number) {
    onChange(options[index].value);
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (
        buttonRef.current?.contains(target) ||
        listRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    }

    function close() {
      setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [isOpen]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          openMenu();
        } else {
          setActiveIndex((index) => Math.min(index + 1, options.length - 1));
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          openMenu();
        } else {
          setActiveIndex((index) => Math.max(index - 1, 0));
        }
        break;
      case "Home":
        if (isOpen) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case "End":
        if (isOpen) {
          event.preventDefault();
          setActiveIndex(options.length - 1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen) {
          selectIndex(activeIndex);
        } else {
          openMenu();
        }
        break;
      case "Escape":
        if (isOpen) {
          // Only close the menu, not a dialog the menu might be inside.
          event.preventDefault();
          event.stopPropagation();
          setIsOpen(false);
        }
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        className={`flex items-center justify-between gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-950 ${className}`}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`shrink-0 text-slate-500 transition-transform dark:text-slate-400 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && position
        ? createPortal(
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label={label}
              className="fixed z-[80] rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-900"
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
              }}
            >
              {options.map((option, index) => (
                <li
                  key={option.value}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={option.value === value}
                  onPointerEnter={() => setActiveIndex(index)}
                  onClick={() => selectIndex(index)}
                  className={`flex h-9 cursor-pointer items-center justify-between gap-2 rounded-lg px-3 text-sm ${
                    index === activeIndex
                      ? "bg-sky-50 text-sky-900 dark:bg-sky-950 dark:text-sky-100"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value ? (
                    <Check size={14} aria-hidden="true" className="shrink-0" />
                  ) : null}
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}
    </>
  );
}

export default Select;
