import type { ReactNode } from "react";

export default function ProfileLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <section className="min-h-full">{children}</section>;
}
