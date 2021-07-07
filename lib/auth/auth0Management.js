import { ManagementClient } from "auth0";
import { auth0 } from "./auth0";

export const auth0Management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
});

export async function getIdPToken(req, res, provider = "google-oauth2") {
  const session = auth0.getSession(req, res);

  if (!session || !session.user) {
    res.status(401).json({
      error: "not_authenticated",
      description:
        "The user does not have an active session or is not authenticated",
    });
    return;
  }

  try {
    const user = await auth0Management.getUser({ id: session.user.sub });
    const idp = user?.identities.find((i) => i.provider === provider);

    if (!idp) {
      res.status(401).json({
        error: "not_found",
        description: `The user has not authorized provider '${provider}'`,
      });
      return;
    }

    return idp.access_token;
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "internal_error",
      description: `getIdPToken Error: Error getting token for idp '${provider}' and user '${session.user.sub}': ${e.message}`,
    });
  }
}
