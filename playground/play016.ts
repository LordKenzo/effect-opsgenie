import { Effect, Data, pipe } from "effect";

class FetchError extends Data.TaggedError("FetchError")<{}> {}
class JsonError extends Data.TaggedError("JsonError")<{}> {}

const fetchRequest = Effect.tryPromise({
  try: () => fetch(`https://dummyjson.com/users`),
  catch: (): FetchError => new FetchError(),
});

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: (): JsonError => new JsonError(),
  });




const program = Effect.gen(function* () {
  const response = yield* fetchRequest;
  if (!response.ok) {
    return yield* new FetchError();
  }
  return yield* jsonResponse(response);
});

Effect.runPromise(program).then(console.log);