# Project README

## How to Run the Code

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo

   ```

2. Install dependencies
   npm install

   # or

   yarn install

3. Set up environment variables in a .env.local file:
   FIREBASE_SERVICE_ACCOUNT_KEY=your_firebase_service_account_key_here
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000

4. Run the application in development mode:
   npm run dev
   # or
   yarn dev

## General Approach:

This project is built using Next.js with the new App Router to create a task management Kanban board application. Firestore, a scalable NoSQL document database, is used as the database for tasks, statuses, comments, and users.

For authentication and user management, NextAuth.js is integrated, providing session handling and role-based access control. User roles (such as Admin and Worker) are stored in Firestore and verified on each API request to enforce permissions for creating, updating tasks and statuses, or commenting on tasks.

Role checks are also implemented on the frontend to disable or hide UI elements according to the current user's permissions. This dual-layer security approach ensures users interact only with features they are authorized to use, enhancing both security and user experience.

## State Management Approach:

Instead of using React Context, the application is structured around custom React hooks, each responsible for handling logic related to specific status and tasks related operations. This decision was made considering the app’s relatively small scope, aiming to keep the codebase simple and modular.

The main state is handled through a parent-level hook, which distributes logic and data to other components via props or through composing additional custom hooks. While this approach effectively meets current requirements, introducing a more scalable state management solution — such as React Context, Redux, or Zustand — is recommended if the application grows in complexity or requires broader global state sharing.

Combined filters support searching by text, creation and due dates, status, and the user who created the task.

Task and Status ordering logic is handled on the backend to avoid inconsistencies when filters are applied.

UI components are built with accessibility and responsiveness in mind, leveraging ShadCN, Radix UI and TailwindCSS.

## Permissions and User Roles

The application defines two user roles — `Admin` and `Worker` — with differentiated permissions enforced through a combination of:

- Middleware protecting specific routes.
- A typed permissions object that defines allowed actions for each role.
- Backend utility functions such as `requirePermission` and `requireSpecialPermission` to validate access control in API routes.
- A frontend helper function `can()` to conditionally render UI elements based on the user's permissions, preventing access to unauthorized features at the interface level.

- **Admins** have full access to the application. They can create, update, delete tasks and statuses, reorder elements, and manage any task.
- **Workers** have limited permissions:
  - They **can create** tasks.
  - They **can edit and delete** tasks that they have created themselves.
  - They **cannot modify** the status, name, description, or due date of tasks created by others.
  - They **can add comments** to any task, including those created by Admins.
  - They **cannot create or delete** any state.
  - They **cannot reorder** any status.

## Assumptions:

- Task order is numeric and is recalculated when a task is created, deleted, or moved to a different status. This approach optimizes performance by avoiding unnecessary reordering during standard updates.
- Status order is also numeric and recalculated when a status is created, deleted, or reordered. This ensures consistent rendering across the board and avoids redundant sorting operations.
- All registered users belong to the same organization and use a shared board.
- The database schema is designed to be scalable and flexible, allowing the future addition of multiple boards if needed.

## Features

- **Kanban-style task board:** Visualize and manage tasks organized by statuses (columns).

- **Drag and drop support for statuses:** Easily reorder statuses by dragging and dropping columns to customize your workflow.

- **Task management:** Create, update, delete tasks.

- **Flexible filtering:** Filter tasks by text search (name or description), status, due date, creation date, and task creator.

- **Comments system:** Users can add comments to tasks, facilitating collaboration and communication.

- **Real-time updates:** Tasks and statuses update in real-time as users modify the board.

- **Order recalculation:** Task and status orderings are recalculated on creation, deletion, and status changes to keep the UI consistent and performant.

- **Authentication and authorization:** Managed via NextAuth and middleware with permission checking functions.

- **Scalable database design:** Tasks, statuses, comments, and users are stored in separate Firestore collections to enable efficient querying and potential future expansion.

## Deployment

The application is deployed and accessible at:  
[https://task-dashboard-u3mq.vercel.app]

Feel free to try it out live!
