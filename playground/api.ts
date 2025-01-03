import { Effect, Context, type ParseResult, Config, Schema } from "effect";
import type { ConfigError } from "effect/ConfigError";
import { FetchError, JsonError } from "./errors";
import { User } from "./userSchema";

interface UserApiImpl {
  readonly getUser: Effect.Effect<
    User,
    FetchError | JsonError | ParseResult.ParseError | ConfigError
  >;
}

export class UserApi extends Context.Tag("UserApi")<UserApi, UserApiImpl>() {
  static readonly Live = UserApi.of({
    getUser: Effect.gen(function* () {
      const baseUrl = yield* Config.string("BASE_URL");

      const response = yield* Effect.tryPromise({
        try: () => fetch(`${baseUrl}/users/1`),
        catch: () => new FetchError(),
      });

      if (!response.ok) {
        return yield* new FetchError();
      }

      const json = yield* Effect.tryPromise({
        try: () => response.json(),
        catch: () => new JsonError(),
      });

      return yield* Schema.decodeUnknown(User)(json);
    }),
  });
  static readonly Test = UserApi.of({
    getUser: Effect.succeed({
      id: 1,
      username: "Lorenzo",
      email: "fake@email.com",
    }),
  });
  
}

