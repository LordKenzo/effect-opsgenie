import { Effect, pipe } from "effect";

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

const mul = (p: number): Effect.Effect<number, number, never> => {
  console.log("price", p, isNaN(p));
  if (!isNaN(p)) return Effect.succeed(p * 2);
  return Effect.fail(p);
};

const handlePrice = (
  price: number
): Effect.Effect<number | string, never, never> =>
  pipe(
    mul(price),
    Effect.catchAll(() => Effect.succeed("Prezzo non valido!"))
  );

const program = pipe(
  tryParseJSON,
  Effect.orElseFail(() => `Ops... non sono riuscito a fare il parse`),
  Effect.flatMap((models) =>
    Effect.forEach(
      models,
      (x, i) =>
        pipe(
          handlePrice(x.price),
          Effect.map((price) => ({
            ...x,
            price,
          }))
        ),
      { concurrency: "unbounded" } // Utilizziamo la concorrenza per parallelizzare
    )
  ),
  Effect.catchAll((e) => Effect.succeed(`Errore catturato: ${e}`)),
  Effect.tap((models) => Effect.sync(() => console.log(models)))
);

Effect.runPromise(program)
  .then(() => console.log("Completato con successo"))
  .catch((err) => console.error(err));
