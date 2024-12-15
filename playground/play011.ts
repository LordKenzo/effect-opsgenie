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
/*
const decodeUserSchemaArray = () => Effect.try({
  try: () =>
    Schema.decodeUnknown(
      Schema.Struct({ userss: Schema.Array(UserSchemaStruct) })
    ),
  catch: () => schemaError,
});
*/

interface HttpError {
  readonly _tag: "HttpError";
}
const httpError: HttpError = { _tag: "HttpError" };

interface ValidationError {
  readonly _tag: "ValidationError";
}
const validationError: ValidationError = { _tag: "ValidationError" };

interface SchemaError {
  readonly _tag: "SchemaError";
}
const schemaError: SchemaError = { _tag: "SchemaError" };

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json() as Promise<Array<User>>,
    catch: () => validationError,
  });

const fetchRequest = Effect.tryPromise({
  try: () => fetch(`https://dummyjson.com/users`),
  catch: () => httpError,
});

/*const validateUsersSchema = (users: Array<User>) =>
  Effect.try({
    try: () => decodeUserSchemaArray(users, { onExcessProperty: "preserve" }),
    catch: () => {
      console.log("qui");
      return schemaError;
    },
  });
*/
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
    () => schemaError
  );
// );

const main = pipe(
  fetchRequest,
  Effect.flatMap(jsonResponse),
  Effect.flatMap(validateUsersSchema),
  Effect.catchTags({
    HttpError: () => Effect.succeed("There was an HTTP error"),
    ValidationError: () => Effect.succeed("There was a JSON Validation error"),
    SchemaError: () => Effect.succeed("There was a Schema validation error")
  })
);

Effect.runPromise(main).then(console.log);
