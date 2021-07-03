import React from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import styles from "./EventInput.module.css";

export function EventInput() {
  const { user, error, isLoading } = useUser();
  console.log("user", user, "error", error, "isLoadgin", isLoading);

  return (
    <div className={styles.root}>
      {user ? (
        // eslint-disable-next-line @next/next/no-html-link-for-pages
        <a href="/api/auth/logout">Logout</a>
      ) : (
        // eslint-disable-next-line @next/next/no-html-link-for-pages
        <a href="/api/auth/login">Click to Login (requires refresh)</a>
      )}
    </div>
  );
}
