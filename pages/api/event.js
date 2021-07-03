import { google } from "googleapis";
import { parseISO, formatISO, add } from "date-fns";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { getIdPToken } from "@/lib/server";

export default withApiAuthRequired(async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "method_not_allowed",
      description: "Method not allowed. Expected POST",
    });
  }

  if (!req.body.date) {
    return res.status(400).json({
      error: "invalid_params",
      description: "Invalid parameters. Expected date string as YYYY-MM-DD",
    });
  }

  if (!req.body.summary) {
    return res.status(400).json({
      error: "invalid_params",
      description: "Invalid parameters. Expected summary string",
    });
  }

  const accessToken = await getIdPToken(req, res);
  const calendar = google.calendar({
    version: "v3",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const startDate = req.body.date;
  const endDate = formatISO(add(parseISO(startDate), { days: 1 }), {
    representation: "date",
  });

  await calendar.events.insert({
    calendarId: "primary",
    resource: {
      summary: req.body.summary,
      start: {
        date: startDate,
      },
      end: {
        date: endDate,
      },
    },
  });

  return res.status(201).json({
    success: true,
  });
});
