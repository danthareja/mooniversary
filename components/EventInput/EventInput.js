import React from "react";
import PropTypes from "prop-types";
import { formatISO } from "date-fns";
import { useUser } from "@auth0/nextjs-auth0";
import { useForm } from "react-hook-form";
import styles from "./EventInput.module.css";

export function EventInput({ title = "<3 Mooniversary", date }) {
  // Auth state
  const { user } = useUser();

  // Form state
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async ({ description }) => {
    await fetch("/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        date: formatISO(date, { representation: "date" }),
      }),
    });
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  console.log("errors", errors, "isSubmitSuccessful", isSubmitSuccessful);

  if (!user) {
    return (
      // eslint-disable-next-line @next/next/no-html-link-for-pages
      <a className={styles.login} href="/api/auth/login">
        Login to add an event
      </a>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="EventInput__description" className={styles.label}>
        What should we do?
      </label>
      <input
        id="EventInput__description"
        {...register("description", { required: true })}
        disabled={isSubmitting}
        placeholder="Something crazy"
        className={styles.input}
      />
      <input
        type="submit"
        value={isSubmitting ? "Booking..." : "Book it"}
        disabled={isSubmitting}
        className={`${styles.input} ${styles.submit}`}
      />
      {errors.description && (
        <div className={styles.error}>We can&apos;t do nothing</div>
      )}
    </form>
  );
}

EventInput.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  title: PropTypes.string,
};
