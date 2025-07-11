import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/firebaseAdmin"; // tu instancia de Firestore
import { registerSchema } from "@/schemas/registerSchema";
import { BCRYPT_SALT_ROUNDS } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.parse(body);
    const { email, password, role } = parsed;

    // Check if User already exists
    const existing = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const newUserRef = db.collection("users").doc();

    await newUserRef.set({
      email,
      password: hashedPassword,
      role: role ?? "Worker",
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "User registered" });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "Unknown Error" }, { status: 500 });
    }
  }
}
