import { NextResponse } from "next/server";
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
