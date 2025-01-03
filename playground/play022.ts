import { Effect, Context } from "effect"

// Dichiarazione di un tag per un servizio che fornisce l'ora corrente
class TimeService extends Context.Tag("MyTimeService")<
  TimeService,
  { readonly now: Effect.Effect<Date> }
>() {}

// Utilizzo del servizio
const program = Effect.gen(function* () {
  const timeService = yield* TimeService
  const currentTime = yield* timeService.now
  console.log(`Current time: ${currentTime.toISOString()}`)
})

// Fornire un'implementazione concreta
//
//      ┌─── Effect<void, never, never>
//      ▼
const runnable = Effect.provideService(program, TimeService, {
  now: Effect.sync(() => new Date())
})

// Esecuzione del programma
Effect.runPromise(runnable)
/*
Esempio di output:
Current time: 2024-12-24T10:30:00.000Z
*/