import { Effect, pipe } from 'effect'

const getDate = Effect.sync(() => Date.now());
const double = (x: number) => x * 2;

const doubleDate = Effect.sync(() => {
  const date = Effect.runSync(getDate); // WTF! Un effetto eseguito dentro un effetto 😈😈😈😈😈😈😈😈 il male!
  return double(date)
});

const doubleDatePipe = 
  pipe(
    getDate,
    Effect.map(double),
    Effect.map(x => x.toString()),
    Effect.map(x => x.toUpperCase())
  )

