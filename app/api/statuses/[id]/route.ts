import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
  const { id } = params;

  try {
    await db
      .collection("boards")
      .doc("shared-board")
      .collection("statuses")
      .doc(id)
      .delete();

    //Reorder
    const snapshot = await db
      .collection("boards")
      .doc("shared-board")
      .collection("statuses")
      .orderBy("order")
      .get();

    const batch = db.batch();

    snapshot.docs.forEach((doc, index) => {
      batch.update(doc.ref, { order: index });
    });

    await batch.commit();

    return NextResponse.json({ message: "Status deleted" });
  } catch (error) {
    console.error("Error deleting status:", error);
    return NextResponse.json(
      { error: "Failed to delete status" },
      { status: 500 }
    );
  }
}
