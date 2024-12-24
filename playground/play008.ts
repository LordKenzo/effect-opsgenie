import { Effect } from "effect";

interface HttpFetchError {
  readonly _tag: "HttpFetchError";
}

/// 👇 la tryPromise ritorna un effetto: Effect<Response, FetchError>
const program = Effect.tryPromise({
  try: () => fetch("https://dummyjson.com/users"),
  catch: (): HttpFetchError => ({ _tag: "HttpFetchError" }),
});

Effect.runPromise(program).then(console.log);
