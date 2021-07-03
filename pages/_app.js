import React from "react";
import Head from "next/head";
import { UserProvider } from "@auth0/nextjs-auth0";
import { Background } from "@/components";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Head>
        <title>Mooniversary</title>
        <meta name="description" content="Mooniversary tracking app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Background />
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
