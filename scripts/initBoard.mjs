import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not defined");
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const db = getFirestore();

const DEFAULT_STATUSES = [
  { id: "todo", name: "TO DO", order: 0 },
  { id: "in_progress", name: "In Progress", order: 1 },
  { id: "test", name: "Test", order: 2 },
  { id: "done", name: "Done", order: 3 },
];

async function initBoard() {
  const boardRef = db.collection("boards").doc("shared-board");
  const boardDoc = await boardRef.get();

  if (!boardDoc.exists) {
    console.log("Creating main board...");
    await boardRef.set({
      name: "Main Board",
      createdAt: new Date(),
      initialized: true,
    });

    const statusesRef = boardRef.collection("statuses");

    for (const status of DEFAULT_STATUSES) {
      const statusRef = statusesRef.doc(status.id);
      await statusRef.set({
        name: status.name,
        order: status.order,
      });
      console.log(`Status ${status.name} created.`);
    }

    console.log("Initialization complete.");
  } else {
    console.log("Board already initialized, nothing to do.");
  }
}

initBoard()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error initializing board:", err);
    process.exit(1);
  });
