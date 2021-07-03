import React from "react";
import PropTypes from "prop-types";
import { formatISO } from "date-fns";
import { useUser } from "@auth0/nextjs-auth0";
import styles from "./EventInput.module.css";

export function EventInput({ title, date }) {
  const { user, error, isLoading } = useUser();
  console.log("user", user, "error", error, "isLoadgin", isLoading);

  React.useEffect(() => {
    fetch("/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description: "do some cool stuff",
        date: formatISO(date, { representation: "date" }),
      }),
    })
      .then((res) => res.json())
      .then((d) => console.log(d));
  }, []);

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

EventInput.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
};
