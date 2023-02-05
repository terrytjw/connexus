// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "../../../prisma/generated/client";

type Data = {
  name: string;
};
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/hello:
 *   get:
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: hello world
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[]>
) {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
}
