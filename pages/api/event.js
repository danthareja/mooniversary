import { google } from "googleapis";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { getIdPToken } from "@/lib/server";

export default withApiAuthRequired(async function handler(req, res) {
  const accessToken = await getIdPToken(req, res);

  const calendar = google.calendar({
    version: "v3",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const events = await calendar.events.list({
    calendarId: "primary",
  });

  console.log("events", events);
  return res.json(events);
});
