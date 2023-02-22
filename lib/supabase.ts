import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  "https://ewxkkwolfryfoidlycjr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3eGtrd29sZnJ5Zm9pZGx5Y2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY5NzQ2MTksImV4cCI6MTk5MjU1MDYxOX0.huNvRoRR8e-LfSONdnBDJEuUSjg63tkGwLfGyzB8mlQ"
);

export async function uploadImage(bucketName: string, imageBase64: string) {
  return supabase.storage
    .from(bucketName)
    .upload(uuidv4(), await dataUrlToFile(imageBase64), {
      contentType: `image/${extractFileExtension(imageBase64)}`,
    });
}

export async function retrieveImageUrl(bucketName: string, urlPath: string) {
  return supabase.storage.from(bucketName).getPublicUrl(urlPath).data.publicUrl;
}

export const dataUrlToFile = async (dataUrl: string): Promise<Blob> => {
  const res = await axios(dataUrl);
  const blob: Blob = res.data;
  return blob;
};

export const extractFileExtension = (dataUrl: string): string => {
  return dataUrl.substring("data:image/".length, dataUrl.indexOf(";base64"));
};
