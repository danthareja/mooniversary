import React from "react";
import styles from "@/styles/Error.module.css";

export default function FourOhFour() {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.description}>page not found</p>
      </div>
    </div>
  );
}
