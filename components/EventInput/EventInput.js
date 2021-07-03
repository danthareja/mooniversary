import React from "react";
import PropTypes from "prop-types";
import { formatISO } from "date-fns";
import { useUser } from "@auth0/nextjs-auth0";
import { useForm } from "react-hook-form";
import styles from "./EventInput.module.css";

export function EventInput({ title = "<3 Mooniversary", date }) {
  const { user, error, isLoading } = useUser();
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

  const onSubmit = async ({ description }, e) => {
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

  console.log(
    "isSubmitting",
    isSubmitting,
    "isSubmitSuccessful",
    isSubmitSuccessful
  );

  return (
    <div className={styles.root}>
      {user ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("description", { required: true })}
            disabled={isSubmitting}
          />
          {errors.description && <p>Last name is required.</p>}
          <input type="submit" disabled={isSubmitting} />
        </form>
      ) : (
        // eslint-disable-next-line @next/next/no-html-link-for-pages
        <a href="/api/auth/login">Click to Login (requires refresh)</a>
      )}
    </div>
  );
}

EventInput.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  title: PropTypes.string,
};
