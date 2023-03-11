import React, { useState } from "react";

import CustomCheckoutInput from "./CustomCheckoutInput";
import StripeTestCards from "./StripeTestCards";

import getStripe from "../../lib/stripe";
import { fetchPostJSON } from "../../lib/stripe/api-helpers";
import { formatAmountForDisplay } from "../../lib/stripe/stripe-helpers";
import Button from "../Button";

export const CURRENCY = "usd";
// Set your amount limits: Use float for decimal currencies and
// Integer for zero-decimal currencies: https://stripe.com/docs/currencies#zero-decimal.
export const MIN_AMOUNT = 10.0;
export const MAX_AMOUNT = 5000.0;
export const AMOUNT_STEP = 5.0;

const PAYMENT_AMOUNT: number = 2;

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Create a Checkout Session.
    const response = await fetchPostJSON("/api/checkout_sessions", {
      amount: PAYMENT_AMOUNT,
    });

    if (response.statusCode === 500) {
      console.error(response.message);
      return;
    }

    // Redirect to Checkout.
    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: response.id,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <StripeTestCards />
      <div className="mt-8 text-center">
        You are paying{" "}
        <span className="font-semibold underline">
          {formatAmountForDisplay(PAYMENT_AMOUNT, CURRENCY)}
        </span>
      </div>
      <div className="mt-4 flex justify-center">
        <Button
          type="submit"
          variant="solid"
          size="md"
          disabled={loading}
          className="bg-orange-400 "
        >
          Proceed with Stripe
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;
