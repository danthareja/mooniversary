import { initAuth0 } from "@auth0/nextjs-auth0";

console.log("AUTH0_BASE_URL", process.env.AUTH0_BASE_URL);
console.log("VERCEL_URL", process.env.VERCEL_URL);
console.log("VERCEL_ENV", process.env.VERCEL_ENV);
console.log("NEXT_PUBLIC_VERCEL_URL", process.env.NEXT_PUBLIC_VERCEL_URL);
console.log("NEXT_PUBLIC_VERCEL_ENV", process.env.NEXT_PUBLIC_VERCEL_ENV);

// Workaround for dynamic AUTH0_BASE_URL env variable
// https://github.com/auth0/nextjs-auth0/issues/383#issuecomment-828661649
export const auth0 = initAuth0({
  baseURL:
    process.env.AUTH0_BASE_URL ||
    `https://${process.env.VERCEL_URL}` ||
    "http://localhost:3000",
});
