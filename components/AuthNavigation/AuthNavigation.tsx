"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import css from "./AuthNavigation.module.css";
import { authStore } from "@/lib/store/authStore";
import { logout } from "@/lib/api/clientApi";

const AuthNavigation = () => {
  const router = useRouter();
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const user = authStore((state) => state.user);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      // ignore error, still clear client state
    }
    authStore.getState().clearIsAuthenticated();
    router.push("/sign-in");
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link href="/profile" prefetch={false} className={css.navigationLink}>
              Profile
            </Link>
          </li>

          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email ?? ""}</p>
            <button className={css.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
              Login
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
              Sign up
            </Link>
          </li>
        </>
      )}
    </>
  );
};

export default AuthNavigation;
