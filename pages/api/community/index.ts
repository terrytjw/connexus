import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Community } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/community:
 *   get:
 *     description: Returns a list of Community objects
 *     parameters:
 *       - in: query
 *         name: keyword
 *         description: The keyword to search communities by. Optional parameter, will retrieve all communities if no parameters are passed
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of Community objects
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Community"
 *   post:
 *     description: Create a Community object
 *     requestBody:
 *       description: Community object to create. Creator's userId is required
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Community"
 *     responses:
 *       200:
 *         description: The created Community object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Community"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Community[] | ErrorResponse>
) {
  const { method, body, query: { keyword } } = req;

  switch (method) {
    case "GET":
      if (keyword) {
        await handleGETWithQuery(keyword as string);
      } else {
        await handleGET();
      }
      break;
    case "POST":
      const community = JSON.parse(JSON.stringify(body)) as Community;
      await handlePOST(community);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET() {
    try {
      const communities = await prisma.community.findMany();
      res.status(200).json(communities);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handleGETWithQuery(keyword: string) {
    try {
      const communities = await prisma.community.findMany({
        where: {
          OR: [
            {
              name: {
                contains: keyword,
                mode: 'insensitive'
              }
            },
            {
              creator: {
                is: {
                  OR: [
                    {
                      displayName: {
                        contains: keyword,
                        mode: 'insensitive'
                      }
                    },
                    {
                      username: {
                        contains: keyword,
                        mode: 'insensitive'
                      }
                    }
                  ],
                }
              }
            },
            {   
              tags: {
                has: keyword.toUpperCase()
              }
            }
          ]
        }
      })
      res.status(200).json(communities);
    } catch (error) {
      console.log(error)
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(community: Community) {
    try {
      const response = await prisma.community.create({
        data: { 
          ...community,
          // for searching tags
          tags: community.tags
            .map(s => s.toUpperCase())
         },
      });
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}