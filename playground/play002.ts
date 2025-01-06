import { Effect, pipe } from "effect";

const one = Effect.sync(() => Date.now());

const two = Effect.sync(() => {
  console.log("side effect");
  return 2;
});

const NEVER = Effect.sync(() => {
  throw new Error("Questo è un difetto");
});

const tryOne = Effect.try(() => {
  throw new Error("Effect cattura l'errore con il try");
});

class JSONParseError extends Error {
  public readonly message: string;
  constructor(message: string) {
    super();
    this.message = message;
  }
}

const tryParseJSON: Effect.Effect<
  ReadonlyArray<{ title: string; price: number }>,
  JSONParseError
> = Effect.try({
  try: () =>
    JSON.parse(
      `[{"title": "iphone", "price": 100}, {"title": "samsung", "price": "ciao"}]`
    ),
  catch: (unknownError) =>
    new JSONParseError(`JSON parsing failed: ${unknownError}}`),
});

const mul = (p: number): Effect.Effect<number, number> => {
  if (!isNaN(p)) return Effect.succeed(p * 2);
  return Effect.fail(p);
};

const program = pipe(
  tryParseJSON,
  Effect.orElseFail(() => `Ops... non sono riuscito a fare il parse`),
  Effect.flatMap((models) =>
    pipe(
      Effect.succeed(
        models.map((x) => ({
          ...x,
          price: Effect.runSync(
            // Bad Practice! Mai Eseguire un Effect dentro un Effect! Poi vedremo come sistemarlo
            pipe(
              mul(x.price),
              Effect.catchAll((_e) => Effect.succeed("Prezzo non valido!"))
            )
          ),
        }))
      )
    )
  ),
  Effect.catchAll((e) => Effect.succeed(`Errore catturato: ${e}`)),
  Effect.tap((models) => Effect.sync(() => console.log(models)))
);

Effect.runSync(program);
