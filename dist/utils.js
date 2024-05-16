"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathImage = exports.numberToEmoji = void 0;
const path_1 = __importDefault(require("path"));
function numberToEmoji(number) {
    let emojis = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
    number = number.toString();
    let result = "";
    for (let i = 0; i < number.length; i++) {
        result += emojis[parseInt(number[i])];
    }
    return result;
}
exports.numberToEmoji = numberToEmoji;
function getPathImage(image) {
    const basePath = path_1.default.resolve(__dirname, "assets");
    const imagePath = path_1.default.resolve(basePath, image);
    return imagePath;
}
exports.getPathImage = getPathImage;
//# sourceMappingURL=utils.js.map