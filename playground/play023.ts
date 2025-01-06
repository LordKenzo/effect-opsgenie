import { Context, Effect, pipe } from "effect";

// Effect<Success, Error, Requirements>

const success: Effect.Effect<number, never, never> = Effect.succeed(1);

const main = Effect.runSync(success);

console.log(main);

const success2 = (): Effect.Effect<number, string, never> => {
  const rand = Math.floor(Math.random() * 2) + 1;
  if (rand === 2) return Effect.succeed(1);
  return Effect.fail("Too low");
};

const main2 = Effect.runSync(success2());

console.log(main2);

// Effect<Success, Error, Requirements>

const success3: Effect.Effect<number, string, Random> = Effect.gen(
  function* () {
    const random = yield* Random;
    const num = yield* random.next;
    const rand = Math.floor(Math.random() * 2) + num;
    if (rand === 2) {
      // Success path
      return rand;
    } else {
      // Fail path
      return yield* Effect.fail("Too low");
    }
  }
);

class Random extends Context.Tag("MyRandomService")<
  Random,
  { readonly next: Effect.Effect<number> }
>() {}

const success3_conPipe = pipe( // da usare al posto di success3 - potevo usare Random.pipe(...)
  Random,
  Effect.andThen((random) => random.next),
  Effect.andThen(
    (randomNumber) => Math.floor(Math.random() * 2) + randomNumber
  ),
  Effect.filterOrFail(
    (rand) => rand === 2, // Condizione di successo
    () => "Too low" // Messaggio di errore
  )
);

const runnable = Effect.provideService(success3, Random, {
  next: Effect.sync(() => 2),
});

const main3 = Effect.runSync(runnable);

console.log(main3);
