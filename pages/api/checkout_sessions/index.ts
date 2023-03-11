import { NextApiRequest, NextApiResponse } from "next";
import { formatAmountForStripe } from "../../../lib/stripe/stripe-helpers";
import Stripe from "stripe";

export const CURRENCY = "sgd";
// Set your amount limits: Use float for decimal currencies and
// Integer for zero-decimal currencies: https://stripe.com/docs/currencies#zero-decimal.
export const MIN_AMOUNT = 10.0;
export const MAX_AMOUNT = 5000.0;
export const AMOUNT_STEP = 5.0;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const amount: number = req.body.amount;
    try {
      // Optional validation of the amount that was passed from the client:
      // if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
      //   throw new Error("Invalid amount.");
      // }
      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: "pay",
        payment_method_types: ["card", "paynow"],
        mode: "payment",
        line_items: [
          {
            // price_data: {
            //   currency: CURRENCY,
            //   unit_amount: formatAmountForStripe(amount, CURRENCY),
            //   product_data: {
            //     name: "Product", // to be dynamic
            //     description: "Product description", // to be dynamic
            //     // images: ["https://example.com/t-shirt.png", "https://example.com/t-shirt2.png"],
            //   },
            // },
            price: "price_1MkOJvCmKD4DhrYcFxZB869R", // to be dynamic
            quantity: 1,
            // adjustable_quantity: { enabled: true, minimum: 1, maximum: 10 },
          },
        ],
        success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}`, // go back to the page where the user came from
      };

      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
