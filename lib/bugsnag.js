// Comes from draft PR here:
// https://github.com/bugsnag/bugsnag-js/pull/1363

import React from "react";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";

export function startBugsnag() {
  let plugins = [new BugsnagPluginReact()];

  if (process.env.NEXT_INTERNAL_IS_SERVER === "true") {
    // This plugin will fail if imported in a client env
    plugins.push(require("@bugsnag/plugin-aws-lambda"));
  }

  Bugsnag.start({
    apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY,
    appVersion: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "development",
    plugins,
    releaseStage: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",
    enabledReleaseStages: ["production", "preview"],
  });
}

export function getServerlessHandler() {
  return Bugsnag.getPlugin("awsLambda").createHandler();
}

export function getReactErrorBoundary() {
  return Bugsnag.getPlugin("react").createErrorBoundary(React);
}
