import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { useRouter } from "next/router";
import { formatISO } from "date-fns";
import { useUser } from "@auth0/nextjs-auth0";
import { useForm } from "react-hook-form";
import styles from "./EventInput.module.css";
export function EventInput({ title = "<3 Mooniversary", date }) {
  const router = useRouter();
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      description: "",
    },
    reValidateMode: "onBlur",
  });

  const onSubmit = async ({ description }) => {
    const response = await fetch("/api/event", {
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

    if (!response.ok) {
      const data = await response.json();
      // sometimes a a user's Auth0 session is still valid
      // but their google accessToken has expired
      // forcing a re-login will correct this issue
      if (data?.error === "token_expired") {
        router.replace(
          `/api/auth/logout?returnTo=/api/auth/login?returnTo=/event`
        );
      } else {
        setValue("description", "");
        setError("description", {
          type: "server",
          message: "Error. Try again later :(",
        });
      }
    }
  };

  // reset form after async submission
  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  if (!user) {
    return (
      <Link href={`/api/auth/login?returnTo=/event`} passHref>
        <a className={styles.login}>Login to add to the list of adventures</a>
      </Link>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("description", { required: true })}
        autoComplete="off"
        disabled={isSubmitting}
        placeholder={
          errors?.description?.type === "required"
            ? "Required"
            : errors?.description?.type === "server"
            ? errors.description.message
            : "What should we do?"
        }
        className={`${styles.input} ${
          errors?.description ? styles.inputError : ""
        }`}
      />
      <input
        type="submit"
        value={isSubmitting ? "Sending..." : "Send it"}
        disabled={isSubmitting}
        className={`${styles.input} ${styles.inputSubmit}`}
      />
    </form>
  );
}

EventInput.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  title: PropTypes.string,
};
