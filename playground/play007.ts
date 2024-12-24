import { Effect, pipe } from 'effect'

const divide = (a: number, b: number): Effect.Effect<number, Error> =>
  b === 0
    ? Effect.fail(new Error("Impossibile dividere per zero"))
    : Effect.succeed(a / b)

const program = pipe(
  Effect.succeed([25, 5] as const),
  Effect.flatMap( ([a,b]) => divide(a, b))
)