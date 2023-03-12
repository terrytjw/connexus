import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma/prisma-helpers";
import {
  PrismaClient,
  Post,
  Merchandise,
  Collection,
  CollectionState,
} from "@prisma/client";
import { retrieveImageUrl, uploadImage } from "../../../lib/supabase";
import { POST_BUCKET } from "../../../lib/constant";
import { createProduct } from "../../../lib/stripe/api-helpers";
import { CollectionwithMerch } from "../../../lib/api-helpers/collection-api";

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
      const collections = JSON.parse(
        JSON.stringify(body)
      ) as CollectionwithMerch;
      await handlePOST(collections);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handlePOST(collection: CollectionwithMerch) {
    try {
      let responses: string[] = [];

      for (const merchandise of collection.merchandise) {
        const name = merchandise.name;
        const price = merchandise.price;
        const description = collection.description ?? "This is a description";
        const image = merchandise.image ?? "";
        const status = collection.collectionState === CollectionState.ON_SALE;
        const productResponse = await createProduct(
          name,
          description,
          image,
          status,
          price
        );

        responses.push(productResponse);
      }

      res.status(200).json(responses);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
