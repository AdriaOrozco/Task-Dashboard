import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getAuthenticatedSession } from "@/lib/getAuthenticatedSession";
import { requirePermission } from "@/lib/requirePermission";
import {
  deleteTaskWithComments,
  reorderBoardStatuses,
} from "@/lib/serverUtils";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, response } = await getAuthenticatedSession();
    if (!session) return response;
    //Check permissions
    if (session.user.role) {
      const permissionCheck = requirePermission(
        session.user.role,
        "update_status"
      );
      if (permissionCheck) return permissionCheck;
    }

    const { id } = await params;
    const { name } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await db
      .collection("boards")
      .doc("shared-board")
      .collection("statuses")
      .doc(id)
      .update({ name });

    return NextResponse.json({ message: "Status updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, response } = await getAuthenticatedSession();
  if (!session) return response;
  //Check permissions
  if (session.user.role) {
    const permissionCheck = requirePermission(
      session.user.role,
      "delete_status"
    );
    if (permissionCheck) return permissionCheck;
  }
  const { id } = await params;

  try {
    const boardStatusesRef = db
      .collection("boards")
      .doc("shared-board")
      .collection("statuses");

    await boardStatusesRef.doc(id).delete();

    //Get status tasks
    const tasksSnapshot = await db
      .collection("tasks")
      .where("statusId", "==", id)
      .get();

    const batch = db.batch();

    //Delete tasks
    for (const taskDoc of tasksSnapshot.docs) {
      await deleteTaskWithComments(taskDoc.id, batch);
    }

    //Reorder remaining statuses
    await reorderBoardStatuses(batch, boardStatusesRef);

    await batch.commit();

    return NextResponse.json({
      message: "Status and related tasks/comments deleted",
    });
  } catch (error) {
    console.error("Error deleting status and related data:", error);
    return NextResponse.json(
      { error: "Failed to delete status and related data" },
      { status: 500 }
    );
  }
}
