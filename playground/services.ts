import { Context, type Array } from "effect";

export class UserCollection extends Context.Tag("UserCollection")<
UserCollection,
  Array.NonEmptyArray<string>
>() {}