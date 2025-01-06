import { Effect, Config } from "effect";

// Define a program that loads HOST and PORT configuration
const program = Effect.gen(function* () {
  const opsGenieApiKey = yield* Config.string("OdSGENIE_API_KEY");

  return `Application started: ${opsGenieApiKey}`;
});

const main = program.pipe(
  Effect.catchAll((error) =>
    Effect.succeed(`Error: Failed to load port. ${error}`)
  )
);

Effect.runPromise(main).then(console.log);
