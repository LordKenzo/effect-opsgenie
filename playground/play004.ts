import fs from "fs";
import { Effect } from "effect";

const readFileEffect = Effect.async<string, NodeJS.ErrnoException>((resume) =>
  fs.readFile("package.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      resume(Effect.fail(err));
    }
    console.log("File content:", data);
    resume(Effect.succeed(data));
  })
);

Effect.runCallback(readFileEffect);
