import { initAuth0 } from "@auth0/nextjs-auth0";

console.log("AUTH0_BASE_URL", process.env.AUTH0_BASE_URL);
console.log("VERCEL_URL", process.env.VERCEL_URL);
console.log("VERCEL_ENV", process.env.VERCEL_ENV);
console.log("NEXT_PUBLIC_VERCEL_URL", process.env.NEXT_PUBLIC_VERCEL_URL);
console.log("NEXT_PUBLIC_VERCEL_ENV", process.env.NEXT_PUBLIC_VERCEL_ENV);

// Workaround for dynamic AUTH0_BASE_URL env variable
// https://github.com/auth0/nextjs-auth0/issues/383#issuecomment-828661649
const auth0 = initAuth0({
  baseURL:
    process.env.AUTH0_BASE_URL ||
    `https://${process.env.VERCEL_URL}` ||
    "http://localhost:3000",
});

export default auth0.handleAuth({
  async logout(req, res) {
    // You don't strictly need to sanitise `req.query.returnTo` because it has to be in Auth0's "Allowed Logout URLs"
    // But if you ever added a local logout option you should sanitise it, like we do with the login `returnTo`
    // eg https://github.com/auth0/nextjs-auth0/blob/beta/src/handlers/login.ts#L70-L72
    const returnTo = req.query.returnTo;
    try {
      await auth0.handleLogout(req, res, {
        returnTo,
      });
    } catch (error) {
      res.status(error.status || 400).end(error.message);
    }
  },
});
