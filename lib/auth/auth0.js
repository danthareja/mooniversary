import { initAuth0 } from "@auth0/nextjs-auth0";

// Workaround for dynamic AUTH0_BASE_URL env variable
// https://github.com/auth0/nextjs-auth0/issues/383#issuecomment-828661649
//
// Use
// import { auth0 } from "@/lib/auth"
// auth0.withAuthenticationRequired()
//
// Instead of
// import { withAuthenticaitonRequired } from "@auth0/nextjs-auth0"
// withAuthenticationRequired()

export const auth0 = initAuth0({
  baseURL:
    process.env.AUTH0_BASE_URL ||
    `https://${process.env.VERCEL_URL}` ||
    "http://localhost:3000",
});
