import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getAuthenticatedSession } from "@/lib/getAuthenticatedSession";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session, response } = await getAuthenticatedSession();
    if (!session) return response;
    const { id } = params;
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
  { params }: { params: { id: string } }
) {
  const { session, response } = await getAuthenticatedSession();
  if (!session) return response;
  const { id } = params;

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
      const taskId = taskDoc.id;

      //Delete comments
      const commentsSnapshot = await db
        .collection("comments")
        .where("taskId", "==", taskId)
        .get();

      commentsSnapshot.forEach((commentDoc) => {
        batch.delete(commentDoc.ref);
      });
      batch.delete(taskDoc.ref);
    }

    //Reorder remaining statuses
    const snapshot = await boardStatusesRef.orderBy("order").get();

    snapshot.docs.forEach((doc, index) => {
      batch.update(doc.ref, { order: index });
    });

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
