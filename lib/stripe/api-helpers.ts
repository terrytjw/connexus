import getStripe from ".";
import { formatAmountForStripe } from "./stripe-helpers";

export async function fetchGetJSON(url: string) {
  try {
    const data = await fetch(url).then((res) => res.json());
    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw err;
  }
}

export async function fetchPostJSON(url: string, data?: {}) {
  try {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data || {}), // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw err;
  }
}

export async function createProduct(
  name: string,
  description: string,
  imageUrl: string,
  isOnSale: boolean,
  price: number
) {

  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const product = await stripe?.products.create({
    name, // merch name
    description, // merch description
    images: [imageUrl], // an array, so only pass in one e.g. ["www.unsplash.com/hdH745FGkd"]
    active: isOnSale, // whether the item's collectionState is ON_SALE
    default_price_data: {
      currency: "sgd",
      unit_amount_decimal: formatAmountForStripe(price, "sgd"), // price of item
    },
  });

  return product.default_price;
}
