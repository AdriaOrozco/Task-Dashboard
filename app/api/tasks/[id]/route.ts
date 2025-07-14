import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { Task } from "@/types/components";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const taskDoc = await db.collection("tasks").doc(id).get();

    if (!taskDoc.exists) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const data = taskDoc.data();

    if (!data?.statusId) {
      return NextResponse.json(
        { error: "Task has no statusId" },
        { status: 400 }
      );
    }

    const statusDoc = await db
      .collection("boards")
      .doc("shared-board")
      .collection("statuses")
      .doc(data.statusId)
      .get();

    const statusName = statusDoc.exists ? statusDoc.data()?.name : null;

    const task: Task = {
      id: taskDoc.id,
      name: data.name,
      description: data.description || "",
      dueDate: data.dueDate ? data.dueDate.toDate().toString() : null,
      statusId: data.statusId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt ?? data.createdAt,
      order: data.order ?? 0,
    };

    return NextResponse.json({
      task: task,
      status: {
        statusName: statusName,
        statusId: task.statusId,
      },
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json({ error: "Error fetching task" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const { name, description, dueDate, comments = [], statusId, order } = body;

    if (!name || !statusId) {
      return NextResponse.json(
        { error: "Task name and statusId are required" },
        { status: 400 }
      );
    }

    const taskRef = db.collection("tasks").doc(id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updateData = {
      name,
      description: description ?? "",
      dueDate: dueDate ? (dueDate ? new Date(dueDate) : null) : null,
      statusId: statusId ?? "",
      order: typeof order === "number" ? order : 0,
      updatedAt: new Date(),
    };
    await taskRef.update(updateData);

    const existingCommentsSnapshot = await db
      .collection("comments")
      .where("taskId", "==", id)
      .get();

    const existingIds = new Set(
      existingCommentsSnapshot.docs.map((doc) => doc.id)
    );

    const batch = db.batch();

    for (const comment of comments) {
      if (!existingIds.has(comment.id)) {
        const commentRef = db.collection("comments").doc(comment.id);
        batch.set(commentRef, {
          ...comment,
          taskId: id,
          createdAt: new Date(),
        });
      }
    }

    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Error updating task" }, { status: 500 });
  }
}
