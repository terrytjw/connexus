import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Community, CategoryType, ChannelType } from "@prisma/client";
import { checkIfStringIsBase64, retrieveImageUrl, uploadImage } from "../../../lib/supabase";
import { COMMUNITY_BUCKET } from "../../../lib/constant";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/community:
 *   get:
 *     description: Returns a list of Community objects
 *     parameters:
 *       - in: query
 *         name: keyword
 *         description: The keyword to search communities by. Searches creator name, community name and tags for a match. Optional parameter, will retrieve all communities if no parameters are passed
 *         schema:
 *           type: string
 *       - in: query
 *         name: filter
 *         description: The tag to filter communities by. Optional parameter.
 *         schema:
 *           type: CategoryType
 *       - in: query
 *         name: cursor
 *         description: The communityId of the last community in the previous page. Pass 0 or don't pass to retrieve first X results
 *         required: true
 *         schema:
 *           type: number
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb'
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Community[] | ErrorResponse>
) {
  const { method, body, query } = req;
  const keyword = query.keyword as string;
  const filter = query.filter as CategoryType[];
  const cursor = parseInt(query.cursor as string);

  switch (method) {
    case "GET":
      if (keyword) {
        await handleGETWithKeyword(keyword, cursor, filter);
      } else {
        await handleGET(cursor, filter);
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

  async function handleGET(cursor: number, filter?: CategoryType[]) {
    try {
      const communities = await prisma.community.findMany({
        take: 10,
        skip: cursor ? 1 : undefined, // Skip cursor
        cursor: cursor ? { communityId : cursor } : undefined,
        orderBy: {
          communityId: 'asc'
        },
        where: {
          tags: filter ? {
            hasSome: filter
          } : undefined,
        },
        include: {
          members: {
            select: { userId: true }
          }
        }
      });
      res.status(200).json(communities);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handleGETWithKeyword(keyword: string, cursor: number, filter?: CategoryType[]) {
    try {
      const communities = await prisma.community.findMany({
        take: 10,
        skip:  cursor ? 1 : undefined, // Skip cursor
        cursor: cursor ? { communityId : cursor } : undefined,
        orderBy: {
          communityId: 'asc'
        },
        where: {
          name: {
            contains: keyword,
            mode: 'insensitive'
          },
          tags: filter ? {
            hasSome: filter
          } : undefined,
        },
        include: {
          members: {
            select: { userId: true }
          }
        }
      })
      res.status(200).json(communities);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(community: Community) {
    try {
      const { profilePic, bannerPic } = community;
      let profilePictureUrl = "";
      let bannerPicUrl = "";

      if (profilePic && checkIfStringIsBase64(profilePic)) {
        const { data, error } = await uploadImage(
          COMMUNITY_BUCKET,
          profilePic
        );

        if (error) {
          const errorResponse = handleError(error);
          res.status(400).json(errorResponse);
        }

        if (data)
          profilePictureUrl = await retrieveImageUrl(
            COMMUNITY_BUCKET,
            data.path
          );
      }

      if (bannerPic && checkIfStringIsBase64(bannerPic)) {
        const { data, error } = await uploadImage(
          COMMUNITY_BUCKET,
          bannerPic
        );

        if (error) {
          const errorResponse = handleError(error);
          res.status(400).json(errorResponse);
        }
        if (data)
          bannerPicUrl = await retrieveImageUrl(COMMUNITY_BUCKET, data.path);
      }

      const updatedCommunityInfo = {
        ...community,
        profilePic: profilePictureUrl,
        bannerPic: bannerPicUrl,
      };
      
      const response = await prisma.community.create({
        data: { 
          ...updatedCommunityInfo,
          channels: {
            create: [
              {
                name: "Home Channel",
                channelType: ChannelType.REGULAR
              }
            ]
          }
        }
      });
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}