import { Toaster } from "sonner";
import { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster theme="dark" position="bottom-right" />
    </>
  );
}
