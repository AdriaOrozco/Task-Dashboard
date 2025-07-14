import { timestampToDate } from "@/lib/utils";
import { Task } from "@/types/components";
import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { createPortal } from "react-dom";

export default function TaskItem({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Cerrar menú si se hace clic fuera
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

  // Al abrir el menú, calculamos la posición para que aparezca debajo del botón
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!openMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4, // 4px margen
        left: rect.left + window.scrollX,
      });
    }
    setOpenMenu((o) => !o);
  };

  return (
    <li className="relative w-full bg-gray-700 max-w-[260px] rounded-lg px-3 py-2 shadow-md hover:bg-gray-600 transition cursor-pointer flex flex-col">
      <div className="flex justify-between items-start">
        <div className="text-sm font-medium text-white truncate max-w-[200px]">
          {task.name}
        </div>

        <div>
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="text-gray-400 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Open task options"
          >
            <MoreVertical color="white" className="h-5 w-5" />
          </button>

          {openMenu &&
            createPortal(
              <div
                ref={menuRef}
                className="fixed w-28 bg-gray-800 border border-gray-600 rounded shadow-lg z-[9999]"
                style={{
                  top: menuPosition.top,
                  left: menuPosition.left,
                }}
              >
                <button
                  className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                    setOpenMenu(false);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  Editar
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-700 hover:text-white cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                    setOpenMenu(false);
                  }}
                >
                  Eliminar
                </button>
              </div>,
              document.body
            )}
        </div>
      </div>

      <div className="text-xs text-gray-300">
        {timestampToDate(task.createdAt)}
      </div>
      <div className="text-sm text-gray-300 overflow-hidden whitespace-nowrap text-ellipsis">
        {task.description || ""}
      </div>
    </li>
  );
}
