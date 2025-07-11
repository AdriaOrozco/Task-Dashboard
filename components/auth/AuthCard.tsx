export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-zinc-800 rounded-3xl shadow-xl p-10 flex flex-col flex-1">
      {children}
    </div>
  );
}
