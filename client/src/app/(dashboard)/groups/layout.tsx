import type { ReactNode } from "react";

export default function GroupsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <section className="min-h-full">{children}</section>;
}
