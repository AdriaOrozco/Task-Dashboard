import { Spinner } from "../ui/spinner";

export default function CardHeaderEditor({
  newName,
  setNewName,
  handleKeyDown,
  isSaving,
  handleChangeName,
  error,
}: {
  newName: string;
  setNewName: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isSaving: boolean;
  handleChangeName: () => void;
  error: string | null;
}) {
  return (
    <div className="mb-4 flex flex-col gap-1 z-10 relative cursor-default">
      <div className="flex items-center gap-2">
        <input
          className="bg-gray-600 text-gray-100 px-2 py-1 rounded outline-none focus:ring ring-violet-500 w-full"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={isSaving}
        />
        {isSaving ? (
          <div className="flex justify-center py-1 min-w-[55px]">
            <Spinner width={22} height={22} />
          </div>
        ) : (
          <button
            onClick={handleChangeName}
            disabled={isSaving || newName.trim() === ""}
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-3 py-1 rounded transition h-8 disabled:opacity-50 cursor-pointer"
          >
            Save
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
