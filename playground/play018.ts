import { Schema } from "effect";

const User = Schema.Struct({
  id: Schema.Number, // id deve essere un numero
});

type User = typeof User.Type;

const user: User = {
  id: 10,
};

// Tentativo di una decodifica di un valore null, lancia un parse error
Schema.decodeUnknownSync(User)(null);
// Tentativo di decodifica di un valore valido, ritorna un oggetto dello schema
Schema.decodeUnknownSync(User)(user);

const AddressSchema = Schema.Struct({
  street: Schema.String,
  city: Schema.String,
  zipCode: Schema.Number,
});

const UserWithAddressSchema = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  address: AddressSchema, // Usiamo uno schema annidato
});