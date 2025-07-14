import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Comment, TaskModalCommentFormProps } from "@/types/components";
import { useSession } from "next-auth/react";
import { can } from "@/lib/utils";

export default function TaskModalCommentsForm({
  newComment,
  setNewComment,
  addComment,
  loadingComments,
  comments,
}: TaskModalCommentFormProps) {
  const { data: session } = useSession();
  return (
    <div className="flex-1 space-y-2 min-w-0">
      <Label className="text-white">Comments</Label>
      {session?.user?.role && can(session.user.role, "create_comment") ? (
        <div className="flex gap-2 items-center">
          <Input
            className="bg-gray-800 border-gray-600 text-white"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addComment();
              }
            }}
          />
          <Button
            variant="secondary"
            className="h-8"
            onClick={(e) => {
              e.preventDefault();
              addComment();
            }}
          >
            Post
          </Button>
        </div>
      ) : null}

      <div className="max-h-57 overflow-auto pr-2 space-y-3">
        {loadingComments ? (
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 bg-gray-700 rounded w-3/4" />
                <Skeleton className="h-4 bg-gray-700 rounded w-full" />
                <Skeleton className="h-4 bg-gray-700 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : null}
        {comments?.length
          ? comments.map((comment: Comment) => (
              <div
                key={comment.id}
                className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm text-white space-y-1"
              >
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium">{comment.authorEmail}</span>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-100">{comment.text}</p>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
