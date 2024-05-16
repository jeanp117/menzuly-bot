"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idleFlow = exports.stop = exports.reset = exports.start = void 0;
const { EVENTS, addKeyword } = require("@bot-whatsapp/bot");
// Object to store timers for each user
const timers = {};
// Flow for handling inactivity
const idleFlow = addKeyword(EVENTS.ACTION, null).addAction((_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { endFlow }) {
    return endFlow("Tiempo de inactividad excedido. Vuelve a iniciar el chat.");
}));
exports.idleFlow = idleFlow;
// Function to start the inactivity timer for a user
const start = (ctx, gotoFlow, ms) => {
    if (timers[ctx.from]) {
        clearTimeout(timers[ctx.from]);
    }
    timers[ctx.from] = setTimeout(() => {
        console.log(`User timeout: ${ctx.from}`);
        return gotoFlow(idleFlow);
    }, ms);
};
exports.start = start;
// Function to reset the inactivity timer for a user
const reset = (ctx, gotoFlow, ms) => {
    stop(ctx);
    if (timers[ctx.from]) {
        console.log(`reset countdown for the user: ${ctx.from}`);
        clearTimeout(timers[ctx.from]);
    }
    start(ctx, gotoFlow, ms);
};
exports.reset = reset;
// Function to stop the inactivity timer for a user
const stop = (ctx) => {
    if (timers[ctx.from]) {
        clearTimeout(timers[ctx.from]);
    }
};
exports.stop = stop;
//# sourceMappingURL=iddle.js.map