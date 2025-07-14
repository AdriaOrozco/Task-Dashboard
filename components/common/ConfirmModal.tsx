import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConfirmModalProps } from "@/types/components";
import { Spinner } from "../ui/spinner";

export default function ConfirmModal({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  loading,
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-700 text-white ">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-gray-300">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          {loading ? (
            <Spinner />
          ) : (
            <>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => onOpenChange(false)}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="h-10 w-25 px-4 text-black hover:bg-gray-300 cursor-pointer flex items-center justify-center"
                >
                  {cancelText}
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                className="h-10 px-4 w-25 cursor-pointer flex items-center justify-center"
                onClick={onConfirm}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {confirmText}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
