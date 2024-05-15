import { existsSync } from "node:fs";
import { join } from "node:path";

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
  let path = join(process.cwd(), "assets", image);
  console.log(path);
  if (!existsSync(path)) {
    console.log("No existe la imagen");
    path = join(process.cwd(), "assets", "default.jpg");
  }
  return path;
}
