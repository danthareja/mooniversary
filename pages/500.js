import React from "react";
import Head from "next/head";
import { Background } from "@/components";
import styles from "@/styles/500.module.css";

export default function FiveHundred() {
  return (
    <React.Fragment>
      <Head>
        <title>Mooniversary | Error</title>
        <meta name="description" content="Mooniversary error page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Background />
      <div className={styles.container}>
        <div className={styles.main}>
          <h1 className={styles.title}>500</h1>
          <p className={styles.description}>something bad happened</p>
        </div>
      </div>
    </React.Fragment>
  );
}
