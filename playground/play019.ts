import { Data, Effect, Schema } from "effect";

/** Errori **/
class FetchError extends Data.TaggedError("FetchError")<{}> {}
class JsonError extends Data.TaggedError("JsonError")<{}> {}

const fetchRequest = Effect.tryPromise({
  try: () => fetch("https://dummyjson.com/users/1"),
  catch: () => new FetchError(),
});

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: () => new JsonError(),
  });

// Importa Schema dalla libreria Effect
const Email = Schema.String
  // Aggiunge annotazioni per fornire un messaggio predefinito in caso di errore
  .annotations({
    message: () => "non è una email valida", // Messaggio che verrà restituito se la stringa non è valida
  })
  .pipe(
    // Applica una validazione tramite una RegExp che verifica se il formato della stringa è quello di un'email
    Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),

    // Applica una validazione sulla lunghezza massima della stringa
    Schema.maxLength(100, {
      message: (issue) => `${issue.actual} is too long`, // Messaggio personalizzato se la lunghezza supera 100 caratteri
    })
  )
  .annotations({
    // tutto facoltativo da qui in giù
    // Aggiungo un identificatore univoco
    identifier: "Email",
    // Aggiungo un titolo per lo schema
    title: "email",
    // Aggiungo una descrizione
    description: "Una mail è una stringa definita da un dominio",
    // Aggiungo un esempio
    examples: ["email@email.com", "email@email.it"],
    // Includo altra eventuale documentazione
    documentation: `...technical information about Email schema...`,
  });

class User extends Schema.Class<User>("User")({
  id: Schema.Number,
  username: Schema.String,
  email: Email,
}) {}

const decodeUser = Schema.decodeUnknown(User);

const program = Effect.gen(function* () {
  const response = yield* fetchRequest;
  if (!response.ok) {
    return yield* new FetchError();
  }

  const json = yield* jsonResponse(response);
  return yield* decodeUser(json);
});

/** Error handling **/
const main = program.pipe(
  Effect.catchTags({
    FetchError: (e) => Effect.succeed(`Fetch error ${e.message}`),
    JsonError: (e) => Effect.succeed(`Json error ${e.message}`),
    ParseError: (e) => Effect.succeed(`Parse error ${e.message}`),
  })
);

Effect.runPromise(main).then(console.log);
