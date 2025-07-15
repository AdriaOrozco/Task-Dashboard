import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { Comment } from "@/types/components";
import { getAuthenticatedSession } from "@/lib/getAuthenticatedSession";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { session, response } = await getAuthenticatedSession();
    if (!session) return response;
    const { taskId } = await params;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const commentsSnapshot = await db
      .collection("comments")
      .where("taskId", "==", taskId)
      .orderBy("createdAt", "asc")
      .get();

    const comments: Comment[] = commentsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        text: data.text,
        authorEmail: data.authorEmail,
        taskId: taskId,
        createdAt: new Date(data.createdAt),
      };
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Error fetching comments" },
      { status: 500 }
    );
  }
}
