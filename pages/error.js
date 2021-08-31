import React from "react";

export default function Error() {
  return (
    <button
      type="button"
      onClick={() => {
        throw new Error("Sentry Frontend Error");
      }}
    >
      Throw error
    </button>
  );
}
