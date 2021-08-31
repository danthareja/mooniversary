import React from "react";
import Head from "next/head";
import { UserProvider } from "@auth0/nextjs-auth0";
import { startBugsnag, getReactErrorBoundary } from "@/lib/bugsnag";
import { Background } from "@/components";
import Error from "./_error";
import "@/styles/globals.css";

startBugsnag();
const ErrorBoundary = getReactErrorBoundary();

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary FallbackComponent={Error}>
      <UserProvider>
        <Head>
          <title>Mooniversary</title>
          <meta name="description" content="Mooniversary tracking app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Background />
        <Component {...pageProps} />
      </UserProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
