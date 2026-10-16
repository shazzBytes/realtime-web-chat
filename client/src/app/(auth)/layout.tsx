import AuthRouteGuard from "@/components/auth/AuthRouteGuard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRouteGuard>{children}</AuthRouteGuard>;
}
