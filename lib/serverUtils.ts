import { Comment } from "@/types/components";
import { db } from "./firebaseAdmin";

export async function deleteCommentsByTaskId(
  taskId: string,
  batch?: FirebaseFirestore.WriteBatch
) {
  const commentsSnapshot = await db
    .collection("comments")
    .where("taskId", "==", taskId)
    .get();

  if (batch) {
    commentsSnapshot.forEach((doc) => batch.delete(doc.ref));
  } else {
    const individualBatch = db.batch();
    commentsSnapshot.forEach((doc) => individualBatch.delete(doc.ref));
    await individualBatch.commit();
  }
}

export async function reorderTasksInStatus(statusId: string) {
  const tasksSnapshot = await db
    .collection("tasks")
    .where("statusId", "==", statusId)
    .orderBy("order")
    .get();

  const batch = db.batch();
  let order = 0;
  tasksSnapshot.forEach((doc) => {
    if (doc.data().order !== order) {
      batch.update(doc.ref, { order });
    }
    order++;
  });
  await batch.commit();
}

export async function reorderStatuses() {
  const boardStatusesRef = db
    .collection("boards")
    .doc("shared-board")
    .collection("statuses");

  const snapshot = await boardStatusesRef.orderBy("order").get();
  const batch = db.batch();

  snapshot.docs.forEach((doc, index) => {
    batch.update(doc.ref, { order: index });
  });

  await batch.commit();
}

export async function deleteTaskWithComments(
  taskId: string,
  batch?: FirebaseFirestore.WriteBatch
) {
  const taskRef = db.collection("tasks").doc(taskId);

  if (batch) {
    await deleteCommentsByTaskId(taskId, batch);
    batch.delete(taskRef);
  } else {
    const individualBatch = db.batch();
    await deleteCommentsByTaskId(taskId, individualBatch);
    individualBatch.delete(taskRef);
    await individualBatch.commit();
  }
}

export async function reorderBoardStatuses(
  batch: FirebaseFirestore.WriteBatch,
  statusesRef: FirebaseFirestore.CollectionReference
) {
  const snapshot = await statusesRef.orderBy("order").get();

  snapshot.docs.forEach((doc, index) => {
    batch.update(doc.ref, { order: index });
  });
}

export async function reorderDocuments(
  collectionRef: FirebaseFirestore.CollectionReference,
  orderedIds: string[]
): Promise<void> {
  //Firestore batch to do multiple operations
  const batch = collectionRef.firestore.batch();
  orderedIds.forEach((id, index) => {
    const docRef = collectionRef.doc(id);
    batch.update(docRef, { order: index });
  });

  await batch.commit();
}

export async function insertNewComments(taskId: string, comments: Comment[]) {
  if (!Array.isArray(comments) || comments.length === 0) return;

  const existingSnapshot = await db
    .collection("comments")
    .where("taskId", "==", taskId)
    .get();

  const existingIds = new Set(existingSnapshot.docs.map((doc) => doc.id));
  const batch = db.batch();

  for (const comment of comments) {
    if (!existingIds.has(comment.id)) {
      const commentRef = db.collection("comments").doc(comment.id);
      batch.set(commentRef, {
        ...comment,
        taskId,
        createdAt: new Date(),
      });
    }
  }

  await batch.commit();
}

export async function createCommentsForTask(
  taskId: string,
  comments: Comment[]
) {
  if (!Array.isArray(comments) || comments.length === 0) return;

  const batch = db.batch();

  for (const comment of comments) {
    if (!comment.id || typeof comment.id !== "string") {
      throw new Error("There is a comment with invalid ID");
    }

    const commentRef = db.collection("comments").doc(comment.id);
    batch.set(commentRef, {
      ...comment,
      taskId,
    });
  }

  await batch.commit();
}
