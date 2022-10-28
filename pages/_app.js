import React from "react";
import Head from "next/head";
import { UserProvider } from "@auth0/nextjs-auth0";

import "@/styles/bootstrap.min.css";
import "@/styles/globals.css";
import "@/styles/birthday.css";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Head>
        <title>Mooniversary</title>
        <meta name="description" content="Mooniversary tracking app" />
        <meta
          name="viewport"
          content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
