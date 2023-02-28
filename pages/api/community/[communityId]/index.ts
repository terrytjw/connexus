// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../../lib/prisma-util";
import { PrismaClient, Community } from "@prisma/client";
import { COMMUNITY_BUCKET } from "../../../../lib/constant";
import { checkIfStringIsBase64, retrieveImageUrl, uploadImage } from "../../../../lib/supabase";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/community/{communityId}:
 *   get:
 *     description: Returns a single Community object. Returns channels associated with the community as well
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         description: String ID of the Community to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Community object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Community"
 *   post:
 *     description: Updates a single Community object
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         description: String ID of the Community to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Community object to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Community'
 *     responses:
 *       200:
 *         description: A single Community object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Community"
 *   delete:
 *     description: Delete a single Community object
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         description: String ID of the Community to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted Community object
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
  res: NextApiResponse<Community | ErrorResponse | {}>
) {
  const { query, method } = req;
  const communityId = parseInt(query.communityId as string);

  switch (req.method) {
    case "GET":
      await handleGET(communityId);
      break;
    case "POST":
      const community = JSON.parse(JSON.stringify(req.body)) as Community;
      await handlePOST(communityId, community);
      break;
    case "DELETE":
      await handleDELETE(communityId);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(communityId: number) {
    try {
      const community = await prisma.community.findUnique({
        where: {
          communityId: communityId,
        },
        include: {
          channels: {
            include: {
              members: {
                select: { userId: true, username: true, profilePic: true }
              }
            }
          },
          creator: {
            select: { profilePic: true, username: true }
          },
          members: {
            select: { userId: true }
          }
        }
      });

      if (!community) res.status(200).json({});
      else res.status(200).json(community);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(communityId: number, community: Community) {
    try {
      const { profilePic, bannerPic } = community;
      let profilePictureUrl = profilePic;
      let bannerPicUrl = bannerPic;

      if (profilePic && ! checkIfStringIsBase64(profilePic)) {
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

      if (bannerPic && ! checkIfStringIsBase64(bannerPic)) {
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
      
      const response = await prisma.community.update({
        where: {
          communityId: communityId,
        },
        data: { ...updatedCommunityInfo, communityId: undefined },
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handleDELETE(communityId: number) {
    try {
      const response = await prisma.community.delete({
        where: {
          communityId: communityId,
        },
      });
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
