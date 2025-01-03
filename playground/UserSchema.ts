import { Schema } from "effect";

const Email = Schema.String.annotations({
  message: () => "non è una email valida",
}).pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/));

export class User extends Schema.Class<User>("User")({
  id: Schema.Number,
  username: Schema.String,
  email: Email,
}) {}
