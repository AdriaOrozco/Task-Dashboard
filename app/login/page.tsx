import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function LoginAndRegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-6xl flex gap-12">
        <AuthCard>
          <LoginForm />
        </AuthCard>
        <AuthCard>
          <RegisterForm />
        </AuthCard>
      </div>
    </main>
  );
}
