import { existsSync } from "node:fs";
import path from "path";

export function numberToEmoji(number) {
  let emojis = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

  number = number.toString();
  let result = "";
  for (let i = 0; i < number.length; i++) {
    result += emojis[parseInt(number[i])];
  }
  return result;
}
export function getPathImage(image: string) {
  const basePath = path.resolve(__dirname, "assets");
  const imagePath = path.resolve(basePath, image);
  return imagePath;
}
