import type { NextApiRequest, NextApiResponse } from "next";
import sgMail, { MailDataRequired } from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export type ConnexusEmail = {
  toEmail: string;
  subject: string;
  text: string;
  html: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  const { text, subject, toEmail, html } = body;

  const msg = {
    to: toEmail,
    from: "connexaofficial@gmail.com",
    subject: subject,
    text: text,
    html: html,
  };

  switch (method) {
    case "POST":
      await sendEmail(msg);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function sendEmail(msg: MailDataRequired) {
    try {
      await sgMail.send(msg);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
