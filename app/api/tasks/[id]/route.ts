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
