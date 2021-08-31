import React from "react";
import Bugsnag from "@bugsnag/js";
import NextErrorComponent from "next/error";

export default function CustomErrorPage({
  statusCode,
  hasGetInitialPropsRun,
  err,
}) {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of
    // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    Bugsnag.notify(err, (event) => {
      event.severity = "error";
      event.unhandled = true;
    });
  }

  return <NextErrorComponent statusCode={statusCode || "Oops"} />;
}

CustomErrorPage.getInitialProps = async (props) => {
  const { req, res, err, asPath } = props;

  const errorInitialProps = await NextErrorComponent.getInitialProps({
    res,
    err,
  });

  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  errorInitialProps.hasGetInitialPropsRun = true;

  const error =
    err ||
    new Error(
      `Unknown error caught by CustomErrorPage.getInitialProps ${asPath}`
    );

  if (errorInitialProps.statusCode !== 404) {
    // Wrap Bugsnag notify in a promise to prevent vercel from killing
    // the serverless function before the bug has been reported
    await new Promise((resolve) =>
      Bugsnag.notify(
        error,
        (event) => {
          event.severity = "error";
          event.unhandled = true;
          event.request = req;
        },
        () => resolve()
      )
    );
  }

  return errorInitialProps;
};
