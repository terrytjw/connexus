import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { PrismaClient,} from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean | ErrorResponse>
) {
  const { method } = req;

  switch (method) {
    case "POST":
      await handlePOST();
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST() {
    try {
      const collections = await prisma.collection.findMany({
        include: { merchandise: true, collectionAnalyticsTimestamps: true }
      });
      for (let collection of collections) {
        const prevAnalyticsTimestamp = collection.collectionAnalyticsTimestamps.at(-1);
        let merchSold = 0 - prevAnalyticsTimestamp!.merchSold;
        let revenue = 0
        for (let merch of collection.merchandise) {
          merchSold += merch.currMerchSupply
          revenue += merch.currMerchSupply * merch.price
        }
        await prisma.collectionAnalyticsTimestamp.create({
          data: {
            merchSold: merchSold,
            revenue: revenue,
            collection: {
              connect: {
                collectionId: collection.collectionId
              }
            }
          }
        });
      }
      res.status(200).json(true);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
