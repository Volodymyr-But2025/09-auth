"use client";

import { useState, useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { authStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const valid = await checkSession();
        if (!mounted) return;
        if (valid) {
          const user = await getMe();
          if (!mounted) return;
          authStore.getState().setUser(user);
        } else {
          authStore.getState().clearIsAuthenticated();
        }
      } catch (err) {
        authStore.getState().clearIsAuthenticated();
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default AuthProvider;
