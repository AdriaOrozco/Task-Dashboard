import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getAuthenticatedSession } from "@/lib/getAuthenticatedSession";
import { requirePermission } from "@/lib/requirePermission";
import { reorderDocuments } from "@/lib/serverUtils";

export async function PUT(req: NextRequest) {
  try {
    const { session, response } = await getAuthenticatedSession();
    if (!session) return response;
    if (session.user.role) {
      const permissionCheck = requirePermission(
        session.user.role,
        "drag_and_drop"
      );
      if (permissionCheck) return permissionCheck;
    }
    const { orderedIds } = await req.json();

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: "Invalid orderedIds" },
        { status: 400 }
      );
    }

    const statusesRef = db
      .collection("boards")
      .doc("shared-board")
      .collection("statuses");

    await reorderDocuments(statusesRef, orderedIds);

    return NextResponse.json({ message: "Order updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating order" },
      { status: 500 }
    );
  }
}
