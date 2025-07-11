import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function PUT(req: NextRequest) {
  try {
    const { orderedIds } = await req.json();

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: "Invalid orderedIds" },
        { status: 400 }
      );
    }

    //Firestore batch to do multiple operations
    const batch = db.batch();
    orderedIds.forEach((id: string, index: number) => {
      const docRef = db
        .collection("boards")
        .doc("shared-board")
        .collection("statuses")
        .doc(id);
      batch.update(docRef, { order: index });
    });

    await batch.commit();

    return NextResponse.json({ message: "Order updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating order" },
      { status: 500 }
    );
  }
}
