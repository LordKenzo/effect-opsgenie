import { Effect, pipe } from "effect";

const wait = (ms: number): Promise<string> =>
  new Promise((resolve) => setTimeout(() => resolve("resolved"), ms));

wait(4000).then(console.log);

const one = Effect.promise(() => wait(2000));

const waitJSON = (ms: number): Promise<{ campo: "valore" }> =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
        const parsed = JSON.parse(`{"campo": "valore"}`);
        resolve(parsed);
      } catch (e) {
        reject(e);
      }
    }, ms)
  );

const two = Effect.tryPromise({
  try: () => waitJSON(2000),
  catch: () => new Error("Errore JSON Parse"),
});

Effect.runPromise(two).then((value) => {
  console.log(value);
});
