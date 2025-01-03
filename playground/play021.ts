import { Effect } from "effect";
import { UserApi } from "./api";

const program = Effect.gen(function* () {
  const userApi = yield* UserApi;
  return yield* userApi.getUser;
});

const runnable = program.pipe(Effect.provideService(UserApi, UserApi.Live));

const main = runnable.pipe(
  Effect.catchTags({
    FetchError: () => Effect.succeed("Fetch error"),
    JsonError: () => Effect.succeed("Json error"),
    ParseError: () => Effect.succeed("Parse error"),
  })
);

Effect.runPromise(main).then(console.log);
