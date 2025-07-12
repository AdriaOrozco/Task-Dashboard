import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const boardRef = db.collection("boards").doc("shared-board");
    const statusesSnap = await boardRef
      .collection("statuses")
      .orderBy("order")
      .get();

    const statuses = statusesSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(statuses);
  } catch (error) {
    console.error("Error fetching statuses:", error);
    return NextResponse.json(
      { error: "Failed to load statuses" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, order } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const docRef = await db
      .collection("boards")
      .doc("shared-board")
      .collection("statuses")
      .add({
        name: name,
        order: order,
      });

    const id = docRef.id;

    return NextResponse.json({
      message: "Status created",
      status: { id, name, order },
    });
  } catch (error) {
    console.error("Error creating status", error);
    return NextResponse.json(
      { error: "Error creating status" },
      { status: 500 }
    );
  }
}
