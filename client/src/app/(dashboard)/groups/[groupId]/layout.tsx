import type { ReactNode } from "react";

export const instant = false;

export default function GroupLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <section className="min-h-full">{children}</section>;
}
