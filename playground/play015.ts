import { Effect } from "effect";

const double = (x: number) => Effect.succeed(x * x);

const main = Effect.gen(function* () {
  const numero = yield* Effect.succeed(stampaNumeri());
  let next = numero.next();
  let value = next.value;
  while (value && !next.done) {
    console.log(yield* Effect.succeed(double(value)));
    next = numero.next();
    if (!next.done) {
      value = next.value;
    } else {
      break;
    }
  }
});

function* stampaNumeri() {
  const array = [1, 2, 3, 4];
  for (let numero of array) yield numero;
}

Effect.runPromise(main);
