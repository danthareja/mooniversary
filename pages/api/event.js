import { google } from "googleapis";
import { parseISO, formatISO, add } from "date-fns";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { getIdPToken } from "@/lib/server";

const createExtendedProperty = (body) => {
  return [["mooniversary", `${body.title}:${body.date}`]];
};

const createEventResource = (body) => {
  const startDate = body.date;
  const endDate = formatISO(add(parseISO(startDate), { days: 1 }), {
    representation: "date",
  });

  return {
    summary: body.title,
    description: `- ${body.description}`,
    start: {
      date: startDate,
    },
    end: {
      date: endDate,
    },
    extendedProperties: {
      shared: Object.fromEntries(createExtendedProperty(body)),
    },
  };
};

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
      description: "Invalid parameters. Expected 'date' string as YYYY-MM-DD",
    });
  }

  if (!req.body.title) {
    return res.status(400).json({
      error: "invalid_params",
      description: "Invalid parameters. Expected 'title' string",
    });
  }

  if (!req.body.description) {
    return res.status(400).json({
      error: "invalid_params",
      description: "Invalid parameters. Expected 'description' string",
    });
  }

  const accessToken = await getIdPToken(req, res);
  const calendar = google.calendar({
    version: "v3",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const eventsList = await calendar.events.list({
    calendarId: "primary",
    // a sharedExtendedProperty is only defined programmatically
    // and will allow us to search for events that may have been renamed
    sharedExtendedProperty: createExtendedProperty(req.body)
      .map(([key, value]) => `${key}=${value}`)
      .join(","),
  });

  const event = eventsList?.data.items[0];

  if (event) {
    console.log(`updating existing event ${event.summary}`);
    await calendar.events.update({
      calendarId: "primary",
      eventId: event.id,
      resource: {
        ...createEventResource(req.body),
        // The description may have been tampered with since creation
        // If it has been deleted, we should create the same description as the first time
        description: event.description
          ? event.description.concat(`\n- ${req.body.description}`)
          : `- ${req.body.description}`,
      },
    });
  } else {
    console.log("creating new event");
    await calendar.events.insert({
      calendarId: "primary",
      resource: createEventResource(req.body),
    });
  }

  return res.status(201).json({
    success: true,
  });
});
