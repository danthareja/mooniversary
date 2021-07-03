import React from "react";
import styles from "@/styles/Error.module.css";

export default function FiveHundred() {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h1 className={styles.title}>500</h1>
        <p className={styles.description}>something bad happened</p>
      </div>
    </div>
  );
}
