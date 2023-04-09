export const BASE_URL = "http://localhost:3000";
// export const BASE_URL = "https://41be-116-15-156-213.ap.ngrok.io";
export const API_URL = `${BASE_URL}/api`;
// export const API_URL = "https://d1bd-116-15-156-213.ap.ngrok.io/api";
export const MERCHANDISE_ENDPOINT = "merch";
export const COLLECTION_ENDPOINT = "collections";
export const USER_ENDPOINT = "users";
export const EVENT_ENDPOINT = "events";
export const TICKET_ENDPOINT = "tickets";
export const USER_TICKET_ENDPOINT = "user-tickets";
export const POST_ENDPOINT = "post";
export const COMMENT_ENDPOINT = "comment";
export const COMMUNITY_ENDPOINT = "community";
export const EMAIL_ENDPOINT = "email";
export const SMS_ENDPOINT = "sms";
export const CHANNEL_ENDPOINT = "channel";
export const QUESTION_ENDPOINT = "question";
export const ANALYTICS_ENDPOINT = "analytics";
export const PROMOTION_ENDPOINT = "promotions";
export const BANK_ACCOUNT_ENDPOINT = "bank-accounts";
export const TRANSACTION_ENDPOINT = "transaction";
export const RAFFLE_PRIZE_USER_ENDPOINT = "raffle-prize-user";

export const USER_PROFILE_BUCKET = "user-profile";
export const EVENT_PROFILE_BUCKET = "event-profile";
export const MERCH_PROFILE_BUCKET = "merch-profile";
export const COMMUNITY_BUCKET = "community";
export const POST_BUCKET = "post";

export const ALCHEMY_API =
  "https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R";

export const smartContract = {
  pinataApiKey: "761ccab4939f8e404ff3",
  pinataSecretApiKey:
    "98e1c1fea584ee66682f6e9e084d4c2fc92413c63cd24caa55d6f39fdf5c7195",
  JWT: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0N2JjMGQ5Mi1jZTA3LTRlMmItYmFmNy00ZDVkOGU2ZjM0MGUiLCJlbWFpbCI6InRha295YWtpbGFtYm9AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6Ijc2MWNjYWI0OTM5ZjhlNDA0ZmYzIiwic2NvcGVkS2V5U2VjcmV0IjoiOThlMWMxZmVhNTg0ZWU2NjY4MmY2ZTllMDg0ZDRjMmZjOTI0MTNjNjNjZDI0Y2FhNTVkNmYzOWZkZjVjNzE5NSIsImlhdCI6MTY4MTAzOTU3M30.0d355YyaJcGy_OQLvBjW7IiAF9UA54HO5aeWXJBfmrA",

  privateKey:
    "3340e2f92064b7494823da63fcaa1dd1515e87e72aaa2d18e461238ce4133cf9",
} as const;
