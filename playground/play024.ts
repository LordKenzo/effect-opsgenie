import { Context, Effect, Layer } from "effect";
import express, { Express } from "express";
import { NextFunction, Request, Response } from "express";

export interface ExpressServiceImpl {
  route: (
    method: "get" | "post",
    path: string,
    handler: express.RequestHandler
  ) => Effect.Effect<void, never, never>;
  listen: (port: number) => Effect.Effect<void, Error, never>;
}

class ExpressService extends Context.Tag("MyExpressService")<
  ExpressService,
  ExpressServiceImpl
>() {
  static app: Express = express();

  static listen(port: number) {
    return Effect.async<void, Error, never>((resolve) => {
      ExpressService.app.listen(port, (err?: Error) => {
        if (err) {
          resolve(Effect.fail(err));
        } else {
          console.log(`Server is listening on port ${port}`);
          resolve(Effect.succeed(undefined));
        }
      });
    });
  }
}

const handler2 = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Hello" });
};

const main = Effect.gen(function* () {
  const s = yield* ExpressService;
  yield* s.route("get", "/", handler2);
  const l = yield* ExpressService.listen(4000);
});

const runnable = Effect.provideService(main, ExpressService, {
  route: (
    method: "get" | "post",
    path: string,
    handler: express.RequestHandler
  ) => {
    return Effect.sync(() => {
      console.log("qui");
      ExpressService.app[method](path, handler);
    });
  },
  listen: (port: number) => Effect.succeed(ExpressService.app.listen(port)),
});


Effect.runPromise(runnable);
