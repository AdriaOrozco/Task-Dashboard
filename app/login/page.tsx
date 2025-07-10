import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function LoginAndRegisterPage() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-6xl flex gap-12">
        <div className="bg-zinc-800 rounded-3xl shadow-xl p-10 flex flex-col flex-1">
          <LoginForm />
        </div>

        <div className="bg-zinc-800 rounded-3xl shadow-xl p-10 flex flex-col flex-1">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
