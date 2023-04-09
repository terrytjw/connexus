import { SMS_ENDPOINT } from "./../constant";
import { ConnexusEmail } from "./../../pages/api/email/index";
import axios from "axios";
import { API_URL, EMAIL_ENDPOINT } from "../constant";
import { ConnexusSMS } from "../../pages/api/sms";

export async function sendEmail(
  toEmail: string,
  subject: string,
  text: string,
  html: string
) {
  const url = `${API_URL}/${EMAIL_ENDPOINT}`;

  const body = {
    toEmail: toEmail,
    subject: subject,
    text: text,
    html: html,
  } as ConnexusEmail;
  const response = (await axios.post(url, body)).data;
  return response;
}

export async function sendSMS(toPhoneNumber: string, message: string) {
  const url = `${API_URL}/${SMS_ENDPOINT}`;

  const body = {
    toPhoneNumber: toPhoneNumber,
    message: message,
  } as ConnexusSMS;
  const response = (await axios.post(url, body)).data;
  return response;
}
