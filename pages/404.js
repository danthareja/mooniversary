import React from "react";
import styles from "@/styles/Home.module.css";

export default function FourOhFour() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Oops</h1>
        <p className={styles.description}>This page does not exist</p>
      </main>
    </div>
  );
}
