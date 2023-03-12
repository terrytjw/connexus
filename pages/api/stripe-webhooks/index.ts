// import { buffer } from "micro";
// // import Cors from "micro-cors";
// import { NextApiRequest, NextApiResponse } from "next";

// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   // https://github.com/stripe/stripe-node#configuration
//   apiVersion: "2022-11-15",
// });

// const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

// // Stripe requires the raw body to construct the event.
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// // const cors = Cors({
// //   allowMethods: ["POST", "HEAD"],
// // });

// const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
//   console.log("test");
//   if (req.method === "POST") {
//     const buf = await buffer(req);
//     const sig = req.headers["stripe-signature"]!;

//     let event: Stripe.Event;

//     try {
//       event = stripe.webhooks.constructEvent(
//         buf.toString(),
//         sig,
//         webhookSecret
//       );
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Unknown error";
//       // On error, log and return the error message.
//       if (err! instanceof Error) console.log(err);
//       console.log(`❌ Error message: ${errorMessage}`);
//       res.status(400).send(`Webhook Error: ${errorMessage}`);
//       return;
//     }

//     // Successfully constructed event.
//     console.log("✅ Success:", event.id);

//     // Cast event data to Stripe object.
//     if (event.type === "payment_intent.succeeded") {
//       const paymentIntent = event.data.object as Stripe.PaymentIntent;
//       console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
//     } else if (event.type === "payment_intent.payment_failed") {
//       const paymentIntent = event.data.object as Stripe.PaymentIntent;
//       console.log(
//         `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
//       );
//     } else if (event.type === "charge.succeeded") {
//       const charge = event.data.object as Stripe.Charge;
//       console.log(`💵 Charge id: ${charge.id}`);
//     } else {
//       console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
//     }

//     // Return a response to acknowledge receipt of the event.
//     res.json({ received: true });
//   } else {
//     res.setHeader("Allow", "POST");
//     res.status(405).end("Method Not Allowed");
//   }
// };

// export default webhookHandler;

import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import { searchUser, updateUser } from "../../../lib/prisma/user-prisma";
import { User } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});
export const config = { api: { bodyParser: false } };
export default async function handleWebhook(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqBuffer = await buffer(req);
  const sig = req.headers["stripe-signature"];
  const event = stripe.webhooks.constructEvent(
    reqBuffer,
    sig!,
    process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET!
  );

  // Handle the event
  switch (event.type) {
    case "checkout.session.async_payment_succeeded":
      // console.log(event.data.)

      // @ts-ignore TODO: type the below line in the future
      const customerEmail = event.data.object.customer_details.email;

      // @ts-ignore TODO: type the below line in the future
      const creatorId = parseInt(event.data.object.client_reference_id);

      // change to creator's Id, passed in from
      const user = (await searchUser({ userId: creatorId })) as User;

      // @ts-ignore TODO: type the below line in the future
      const earningsAfterCommission =
        // @ts-ignore TODO: type the below line in the future
        (event.data.object.amount_total / 100) * 0.95; // Connexus takes 5% commission, divided by 100 because it is in cents

      const updatedUser = await updateUser(user.userId, {
        walletBalance: user.walletBalance + earningsAfterCommission,
      });

      console.log("user -> ", updatedUser);

      console.log("payment suceeded event customer details -> ", customerEmail);
      // console.log("checkout.session -> ", event);
      break;
    case "payment_intent.succeeded":
      // Perform some action based on the payment intent succeeded event
      // console.log("paymentIntent Success -> ", event);
      // console.log("payment success");

      break;
    case "payment_intent.payment_failed":
      // Perform some action based on the payment intent failed event
      // console.log("payment failed -> ", event);
      // console.log("payment failed");
      break;
    default:
    // console.log(event);
    // console.log(`Unhandled event type -> ${event.type}`);
  }

  // Send a response to confirm receipt of the event
  res.status(200).json({ received: true });
}
