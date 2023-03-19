import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export type ConnexusSMS = {
  toPhoneNumber: string;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  const { message, toPhoneNumber } = body;

  const data = {
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: toPhoneNumber,
  };

  switch (method) {
    case "POST":
      await sendSMS(data);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function sendSMS(data: any) {
    try {
      await client.messages.create(data);
      res.status(200).json({ message: "SMS sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
