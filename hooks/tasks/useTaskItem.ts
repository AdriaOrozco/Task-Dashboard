import { useEffect, useRef, useState } from "react";

export function useTaskItem() {
  const [openMenu, setOpenMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  //Close menu if target is outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calc position
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!openMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
    setOpenMenu((o) => !o);
  };

  const openDeleteConfirmation = () => {
    setOpenMenu(false);
    setConfirmDeleteOpen(true);
  };

  return {
    toggleMenu,
    menuPosition,
    buttonRef,
    openMenu,
    menuRef,
    setOpenMenu,
    openDeleteConfirmation,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
  };
}
