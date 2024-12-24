import { Effect, pipe, Schema } from "effect";

interface User {
  username: string;
}
const UserSchemaStruct = Schema.Struct({
  id: Schema.Number,
  username: Schema.String,
  email: Schema.String,
});
const decodeUserSchemaArray = Schema.decodeUnknown(
  Schema.Struct({ users: Schema.Array(UserSchemaStruct) })
);

class HttpError {
  readonly _tag = "HttpError";
}

class ValidationError {
  readonly _tag = "ValidationError";
}

class SchemaError {
  readonly _tag = "SchemaError";
}

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json() as Promise<Array<User>>,
    catch: () => new ValidationError(),
  });

const fetchRequest = Effect.tryPromise({
  try: () => fetch(`https://dummyjson.com/users`),
  catch: () => new HttpError(),
});

const validateUsersSchema = (users: Array<User>) =>
  // pipe(
  // Effect.flatMap((x) =>
  //   Either.match(Either.right(x), {
  //     onLeft: (left) => Effect.fail(schemaError),
  //     onRight: (right) => Effect.succeed(`The Right value is: ${right}`),
  //   })
  // ),
  Effect.mapError(
    decodeUserSchemaArray(users, { onExcessProperty: "preserve" }),
    () => new SchemaError()
  );
// );

const program = pipe(
  fetchRequest,
  Effect.flatMap(jsonResponse),
  Effect.flatMap((x) => validateUsersSchema(x)),
  Effect.catchTag(
    "HttpError", // 👈 Error to catch: HttpError
    (_HttpError) => Effect.succeed("There was an HTTP error")
  ),
  Effect.catchTag(
    "ValidationError", // 👈 Error to catch: ValidationError
    (_ValidationError) => Effect.succeed("There was a Validation error")
  ),
  Effect.catchTag(
    "SchemaError", // 👈 Error to catch: SchemaError
    (_SchemaError) => Effect.succeed("There was a Schema error")
  )
);

Effect.runPromise(program).then(console.log);
