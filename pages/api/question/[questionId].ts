import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { PrismaClient, Question } from "@prisma/client";
import { createQuestion, getAllQuestionsInChannel } from "../../../lib/prisma/question-prisma";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/question:
 *   get:
 *     description: Returns a list of Question objects in a Channel
 *     parameters:
 *       - in: query
 *         name: channelId
 *         required: true
 *         description: String ID of the Channel to retrieve questions from
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of Question objects
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Question"
 *   post:
 *     description: Create a Question object. channelId and userId are required.
 *     requestBody:
 *       name: Question
 *       required: true
 *       description: Question object to create
 *       application/json:
 *       schema:
 *         $ref: "#/components/schemas/Question"
 *     responses:
 *       200:
 *         description: The created Question object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Question"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Question[] | ErrorResponse>
) {
  const { method, body, query } = req;

  switch (method) {
    case "GET":
      const postId = parseInt(query.channelId as string);
      await handleGET(postId);
      break;
    case "POST":
      const comment = JSON.parse(JSON.stringify(body)) as Question;
      await handlePOST(comment);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET(channelId: number) {
    try {
      const questions = await getAllQuestionsInChannel(channelId);
      res.status(200).json(questions);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(question: Question) {
    try {
      const response = await createQuestion(question);
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
