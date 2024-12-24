import { Effect, pipe } from "effect";

interface FetchError {
  readonly _tag: "FetchError";
}
interface JsonError {
  readonly _tag: "JsonError";
}

const fetchRequest = Effect.tryPromise({
  try: () => fetch(`https://dummyjson.com/users`),
  catch: (): FetchError => ({ _tag: "FetchError" }),
});

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: (): JsonError => ({ _tag: "JsonError" }),
  });

const program = pipe(
  fetchRequest,
  Effect.filterOrFail(
    (response) => response.ok,
    (): FetchError => ({
      _tag: "FetchError",
    })
  ),
  Effect.flatMap(jsonResponse),
  Effect.catchTags({
    FetchError: () => Effect.succeed("Fetch error"),
    JsonError: () => Effect.succeed("Json error"),
  })
);

// Effect.runPromise(program).then(console.log);

 
