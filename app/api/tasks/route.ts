import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { Comment, Task } from "@/types/components";
import { getAuthenticatedSession } from "@/lib/getAuthenticatedSession";
import { requirePermission } from "@/lib/requirePermission";

export async function POST(req: NextRequest) {
  try {
    const { session, response } = await getAuthenticatedSession();
    if (!session) return response;
    const userEmail = session?.user?.email;
    if (!userEmail) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    if (session.user.role) {
      const permissionCheck = requirePermission(
        session.user.role,
        "create_task"
      );
      if (permissionCheck) return permissionCheck;
    }
    const body = await req.json();
    const { name, description, dueDate, comments = [], statusId, order } = body;

    if (!name || !statusId) {
      return NextResponse.json(
        { error: "Name and statusId are required" },
        { status: 400 }
      );
    }

    //Create task
    const taskRef = await db.collection("tasks").add({
      name,
      description: description || "",
      dueDate: dueDate ? new Date(dueDate) : null,
      statusId,
      createdAt: new Date(),
      order: order,
      createdBy: userEmail,
    });

    //Create comments
    const batch = db.batch();

    for (const comment of comments) {
      if (!comment.id || typeof comment.id !== "string") {
        throw new Error("There is a comment with invalid ID");
      }
    }

    comments.forEach((comment: Comment) => {
      const commentRef = db.collection("comments").doc(comment.id);

      batch.set(commentRef, {
        ...comment,
        taskId: taskRef.id, //Join comment with task
      });
    });

    await batch.commit();

    const now = new Date();
    const seconds = Math.floor(now.getTime() / 1000);
    const nanoseconds = (now.getTime() % 1000) * 1_000_000;

    const newTask: Task = {
      id: taskRef.id,
      name,
      description: description || "",
      dueDate: dueDate ? new Date(dueDate).toString() : null,
      statusId,
      createdBy: userEmail,
      createdAt: {
        _seconds: seconds,
        _nanoseconds: nanoseconds,
      },
      updatedAt: {
        _seconds: seconds,
        _nanoseconds: nanoseconds,
      },
      order,
    };

    return NextResponse.json({ message: "Task created", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}
