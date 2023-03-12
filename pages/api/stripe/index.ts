import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import { PrismaClient, Post, Merchandise } from "@prisma/client";
import { retrieveImageUrl, uploadImage } from "../../../lib/supabase";
import { POST_BUCKET } from "../../../lib/constant";
import { createProduct } from "../../../lib/stripe/api-helpers";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ErrorResponse>
) {
  const { method, body, query } = req;

  switch (method) {
    case "POST":
      const post = JSON.parse(JSON.stringify(body)) as Merchandise[];
      await handlePOST(post);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(merchandises: Merchandise[]) {
    try {
      let responses: string[] = [];

      for (const merchandise of merchandises) {
        const name = merchandise.name;
        const price = merchandise.price;

        const productResponse = await createProduct(name, price);

        responses.push(productResponse);
      }

      res.status(200).json(responses);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
