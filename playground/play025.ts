import { Context, Effect, Layer } from "effect";
import express, { Express } from "express";
import { pipe } from "effect";
import type { Request, Response } from "express";

interface ExpressServiceImpl {
  readonly setApp: Effect.Effect<Express, never>;
}

const base = () => {
  return express();
};

export class ExpressService extends Context.Tag("ExpressService")<
  ExpressService,
  ExpressServiceImpl
>() {
  static readonly Live = ExpressService.of({
    setApp: Effect.succeed(base()),
  });
}

export const ServerLive = Layer.scopedDiscard(
  Effect.gen(function* () {
    const port = 4000;
    const server_url = "http://localhost";

    const { setApp } = yield* ExpressService;
    const app = yield* setApp;

    yield* Effect.acquireRelease(
      Effect.sync(() => {
        const server = app.listen(port, () => {
          console.log(`Listening at ${server_url}:${port}`);
        });
        return server;
      }),
      (server) => Effect.sync(() => server.close())
    );
  })
);

const BaseController = Effect.gen(function* () {
  const { setApp } = yield* ExpressService;
  const app = yield* setApp;

  const body = (_req: Request, res: Response) =>
    Effect.sync(() => {
      res.send({ message: "Hello World" });
    });

  app.get("/", async (req: Request, res: Response) => {
    await Effect.runPromise(body(req, res));
  });
});

const setAppLive = Layer.sync(ExpressService, () => ExpressService.Live);
const BaseControllerLive = Layer.scopedDiscard(BaseController);
const AppLive = ServerLive.pipe(Layer.provide(setAppLive));

const ControllerLive = Layer.mergeAll(BaseControllerLive);

const program = AppLive.pipe(
  Layer.provide(ControllerLive),
  Layer.provide(setAppLive)
);

Effect.runFork(Layer.launch(program)).pipe(
  Effect.catchAll((error) =>
    Effect.sync(() => {
      console.error("Failed to start the application:", error);
      process.exit(1);
    })
  )
);
