import { Effect, Context } from 'effect';
import type { Config } from 'effect/Config';
import * as fs from 'fs/promises';

interface ConfigService {
  getConfig: Effect.Effect<Config<string>, Error>;
}

const ConfigServiceTag = Context.Tag('ConfigService')<ConfigService, ConfigService>();

const LiveConfigService = ConfigServiceTag.of({
  getConfig: Effect.gen(function* () {
    const configString = yield* Effect.tryPromise(() => fs.readFile('config.json', 'utf8'));
    return JSON.parse(configString);
  })
});

