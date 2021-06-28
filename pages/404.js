import React from "react";
import Head from "next/head";
import { Background } from "@/components";
import styles from "@/styles/404.module.css";

export default function FourOhFour() {
  return (
    <React.Fragment>
      <Head>
        <title>Mooniversary | Not Found</title>
        <meta name="description" content="Mooniversary not found page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Background />
      <div className={styles.container}>
        <div className={styles.main}>
          <h1 className={styles.title}>404</h1>
          <p className={styles.description}>page not found</p>
        </div>
      </div>
    </React.Fragment>
  );
}
