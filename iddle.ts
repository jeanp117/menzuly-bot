const { EVENTS, addKeyword } = require("@bot-whatsapp/bot");
// Object to store timers for each user
const timers = {};

// Flow for handling inactivity
const idleFlow = addKeyword(EVENTS.ACTION, null).addAction(
  async (_, { endFlow }) => {
    return endFlow("Tiempo de inactividad excedido. Vuelve a iniciar el chat.");
  }
);

// Function to start the inactivity timer for a user
const start = (ctx, gotoFlow: (a) => Promise<void>, ms: number) => {
  if (timers[ctx.from]) {
    clearTimeout(timers[ctx.from]);
  }
  timers[ctx.from] = setTimeout(() => {
    console.log(`User timeout: ${ctx.from}`);
    return gotoFlow(idleFlow);
  }, ms);
};

// Function to reset the inactivity timer for a user
const reset = (ctx, gotoFlow: (a) => Promise<void>, ms: number) => {
  stop(ctx);
  if (timers[ctx.from]) {
    console.log(`reset countdown for the user: ${ctx.from}`);
    clearTimeout(timers[ctx.from]);
  }
  start(ctx, gotoFlow, ms);
};

// Function to stop the inactivity timer for a user
const stop = (ctx) => {
  if (timers[ctx.from]) {
    clearTimeout(timers[ctx.from]);
  }
};

export { start, reset, stop, idleFlow };
