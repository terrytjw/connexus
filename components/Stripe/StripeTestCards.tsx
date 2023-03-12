import CustomLink from "../CustomLink";

const StripeTestCards = () => {
  return (
    <div className="">
      Use any of the{" "}
      <CustomLink
        href="https://stripe.com/docs/testing#cards"
        openInNewPage
        className="underline"
      >
        Stripe test credit cards
      </CustomLink>{" "}
      for this demo, e.g.{" "}
      <span className="font-semibold text-gray-400">4242-4242-4242-4242</span>
    </div>
  );
};

export default StripeTestCards;
