"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/AuthContext";
import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
