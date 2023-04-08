// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleError,
  ErrorResponse,
} from "../../../../../lib/prisma/prisma-helpers";
import { filterAttendee } from "../../../../../lib/prisma/event-prisma";
import { createObjectCsvWriter } from "csv-writer";
import { join } from "path";
import { createReadStream } from "fs";
import { promisify } from "util";
import fs from "fs";

const unlink = promisify(fs.unlink);

/**
 * @swagger
 * /api/events/{eventId}/attendee/csv
 *   comment:
 *     description: Export a list of User objects that are attending the Event
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: Event ID of the Event.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A url pointing to the csv file
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<String | ErrorResponse>
) {
  const { query, method } = req;
  const eventId = parseInt(query.eventId as string);

  switch (req.method) {
    case "GET":
      await handleGET(eventId);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(eventId: number) {
    try {
      const response = await filterAttendee(eventId);
      const csvWriter = createObjectCsvWriter({
        path: join(process.cwd(), "public", "data.csv"),
        header: [
          { id: "userId", title: "UserId" },
          { id: "phoneNumber", title: "Phone Number" },
          { id: "displayName", title: "Display Name" },
          { id: "email", title: "Email" },
        ],
      });

      // Write the data to a CSV file
      await csvWriter.writeRecords(response);

      // Set the response headers to allow file download
      res.setHeader("Content-Disposition", "attachment; filename=data.csv");
      res.setHeader("Content-Type", "text/csv");

      // Send the CSV file to the client
      const stream = createReadStream(
        join(process.cwd(), "public", "data.csv")
      );
      stream.pipe(res);

      // Delete the CSV file after a specified amount of time has elapsed
      setTimeout(async () => {
        await unlink(join(process.cwd(), "public", "data.csv"));
      }, 5000); // delete the file after 5 seconds
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
