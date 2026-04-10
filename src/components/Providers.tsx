import { AuthProvider } from "@/context/AuthContext";
import { Agentation } from "agentation";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      {process.env.NODE_ENV === "development" && <Agentation />}
    </AuthProvider>
  );
}
