import AuthLayout from "@/components/auth/AuthLayout";
import AuthNavbar from "@/components/auth/AuthNavbar";
import AuthHero from "@/components/auth/AuthHero";
import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <AuthLayout
      navbar={<AuthNavbar />}
      left={<AuthHero />}
      right={<LoginForm />}
    />
  );
}
