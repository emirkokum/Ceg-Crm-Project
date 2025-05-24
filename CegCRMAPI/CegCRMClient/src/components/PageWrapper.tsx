import { ReactNode } from "react";

export default function PageContainer({ children }: { children: ReactNode }) {
  return <div className="px-4 lg:px-6">{children}</div>;
}
