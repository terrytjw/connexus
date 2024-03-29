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
  function checkPromo(promoId: string) {
    if (promoId) {
      return {
        discounts: [
          {
            coupon: promoId,
          },
        ],
      };
    } else {
      return {};
    }
  }

  if (req.method === "POST") {
    const priceId: string = req.body.priceId;
    const creatorId: string = req.body.creatorId;
    const promoId: string = req.body.promoId;
    const paymentSuccessUrl: string = req.body.paymentSuccessUrl;

    try {
      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: "pay",
        payment_method_types: ["card", "paynow"],
        mode: "payment",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        ...checkPromo(promoId),
        // discounts: [
        //   {
        //     coupon: "ZGntXm9g",
        //   },
        // ],
        client_reference_id: creatorId, // the creator's Id for querying the DB later to add to his balance
        // success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        success_url: `${req.headers.origin}/${paymentSuccessUrl}`,
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
