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
// import { Flujos } from "./flowSedes";
const iddle_1 = require("./iddle");
const utils_1 = require("./utils");
const { createBot, createProvider, createFlow, addKeyword, EVENTS, } = require("@bot-whatsapp/bot");
const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");
let flujosIndice = {};
let flujosKeywords = new Set();
let flujosArray = [];
fetch(process.env.FLUJOS_URL)
    .then((response) => response.json())
    .then((data) => {
    flujosArray = data;
    console.log(flujosArray.length + " Flujos cargados correctamente");
})
    .catch((error) => {
    throw new Error("No se pudo cargar los flujos");
});
flujosArray.map((flow) => {
    var _a;
    if (flow.keywords)
        Array.from(flow.keywords).forEach((keyword) => flujosKeywords.add(keyword));
    let flujo = addKeyword(flow.keywords ? flow.keywords : EVENTS.ACTION);
    // for of with key value
    if (flow.body) {
        for (let index = 0; index < flow.body.length; index++) {
            const message = flow.body[index];
            const isLast = index === flow.body.length - 1;
            flujo = flujo.addAnswer(message.text, {
                media: ((_a = message.media) === null || _a === void 0 ? void 0 : _a.includes("http"))
                    ? message.media
                    : message.media
                        ? (0, utils_1.getPathImage)(message.media)
                        : undefined,
                delay: message.delay || undefined,
                capture: isLast ? flow.capture : false,
            });
        }
    }
    flujo = flujo.addAction((ctx_1, _b) => __awaiter(void 0, [ctx_1, _b], void 0, function* (ctx, { flowDynamic, gotoFlow, state, fallBack }) {
        var _c;
        //se actualiza el flujo anterior
        try {
            state.update({ previousFlow: state.get("currentFlow") });
        }
        catch (error) { }
        state.update({ currentFlow: flow.name });
        if (flow.action) {
            if (typeof flow.action === "string") {
                let action = new Function("{ ctx, gotoFlow, state, fallBack, flowDynamic }", `
        ${flow.action}
      `);
                action(ctx, { gotoFlow, state, fallBack, flowDynamic });
            }
            if (typeof flow.action === "function") {
                flow.action(ctx, { gotoFlow, state, fallBack, flowDynamic });
            }
        }
        if (!flow.capture)
            return;
        if (flow.timeout) {
            (0, iddle_1.start)(ctx, gotoFlow, flow.timeout || 30000);
            (0, iddle_1.reset)(ctx, gotoFlow, flow.timeout || 30000);
        }
        let userResponse = textNormalizer(ctx.body + "");
        if (!flow.options)
            return;
        let optionFound = flow.options.find((option) => {
            //si es estricto, debe ser exactamente igual, si no se permite que el texto del usuario contenga la palabra clave
            return option.keywords.find((keyword) => {
                if (option.strict == false) {
                    return userResponse.includes(textNormalizer(keyword));
                }
                else {
                    return userResponse === textNormalizer(keyword);
                }
            });
        });
        if (optionFound) {
            if (optionFound.response) {
                for (let index = 0; index < optionFound.response.length; index++) {
                    const message = optionFound.response[index];
                    yield flowDynamic(message.text, {
                        media: ((_c = message.media) === null || _c === void 0 ? void 0 : _c.includes("http"))
                            ? message.media
                            : message.media
                                ? (0, utils_1.getPathImage)(message.media)
                                : undefined,
                        delay: message.delay || undefined,
                    });
                }
            }
            //TO DO: implementar actions aqui
            //si la opción encontrada tiene un flujo siguiente, se redirige al flujo
            if (optionFound.nextFlow) {
                let flowName = optionFound.nextFlow;
                let nextFlow = flujosIndice[flowName];
                if (!nextFlow) {
                    throw new Error("No se encontró el flujo");
                }
                else {
                    return gotoFlow(nextFlow);
                }
            }
            if (optionFound.goBack) {
                let previousFlow = state.get("previousFlow");
                if (previousFlow && flujosIndice[previousFlow])
                    gotoFlow(flujosIndice[previousFlow]);
            }
            return;
        }
        else {
            //si la respuesta del usuario es una palabra clave, no se procesa
            if (flujosKeywords.has(userResponse))
                return;
            //si la opción no es válida, se anula el cambio  flujo actual y se pone el anterior
            state.update({ currentFlow: state.get("previousFlow") });
            //si la respuesta del usuario no es una palabra clave, se ejecuta el fallback del flujo
            return yield fallBack(flow.fallBack || `*${userResponse}* no es una opción válida.`);
        }
    }));
    flujosIndice[flow.name] = flujo;
    return flujo;
});
const textNormalizer = (text) => {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase();
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([...flujosArray, iddle_1.idleFlow]);
    const adapterProvider = createProvider(BaileysProvider);
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
    adapterProvider._events.require_action = () => {
        console.log("Whatsapp Bot no enlazado. Escanea el código QR.");
    };
    adapterProvider._events.ready = () => {
        console.log("Whatsapp Bot está listo!");
    };
    adapterProvider._events.auth_failure = (error) => {
        console.error("Error de autenticación: " + error);
    };
    QRPortalWeb();
});
main();
//# sourceMappingURL=app.js.map