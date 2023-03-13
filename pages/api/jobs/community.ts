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
      const communities = await prisma.community.findMany({
        include: {
          _count: {
            select: { members: true }
          }
        }
      });
      for (let community of communities) {
        await prisma.communitySizeTimestamp.create({
          data: {
            members: community._count.members,
            community: {
              connect: {
                communityId: community.communityId
              }
            }
          }
        })
      }
      res.status(200).json(true);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
