import { searchUser } from "./user";

export function randomIntBetweenNumber(
  min: number = 1,
  max: number = 9999
): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function generateUniqueUsername(username: string) {
  let randomNumber = randomIntBetweenNumber();
  let uniqueName = `${username}#${randomNumber}`;
  while (true) {
    const response = await searchUser({
      username: uniqueName,
    });

    if (!response) return uniqueName;
    randomNumber = randomIntBetweenNumber();
    uniqueName = `${username}#${randomNumber}`;
  }
}
