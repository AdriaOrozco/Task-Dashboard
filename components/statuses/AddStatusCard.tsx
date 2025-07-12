import { CreateOperationsType } from "@/types/components";

export default function AddStatusCard({
  createOperations,
}: {
  createOperations: CreateOperationsType;
}) {
  return createOperations.isEditing ? (
    <div className="h-[70px] min-w-[320px] bg-gray-700 p-4 rounded-xl border border-gray-600">
      <input
        autoFocus
        value={createOperations.value}
        onChange={(e) => createOperations.setValue(e.target.value)}
        onKeyDown={(e) => {
          createOperations.handleKeyDown(e);
        }}
        onBlur={() => createOperations.handleCreateNewStatus()}
        className="w-full p-2 rounded bg-gray-600 text-white"
        placeholder="Status name"
      />
    </div>
  ) : (
    <button
      onClick={() => createOperations.setIsEditing(true)}
      className="text-left h-[70px] min-w-[320px] bg-gray-700 p-4 rounded-xl border border-dashed border-gray-500 text-gray-400 hover:border-violet-600 hover:text-white transition cursor-pointer"
    >
      + Add state
    </button>
  );
}
