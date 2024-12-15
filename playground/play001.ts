import { Effect } from 'effect'

type Operation = '+' | '-' | '*' | '/';

type Context = {
  operation: Operation,
  factor: number
}

const operationByContext = (
  a: number,
  b: number,
  op: Operation
): Effect.Effect<number, Error, Context> => {
  switch (op) {
    case '+':
      return Effect.succeed(a + b);
    case '-':
      return Effect.succeed(a - b);
    case '*':
      return Effect.succeed(a * b);
    case '/': // l'unica che può fallire
      return b === 0
        ? Effect.fail(new Error(`Impossibile dividere per zero`))
        : Effect.succeed(a / b);
    default:
      throw new Error(`Unknown operation: ${op}`);
  }
};


const addTwo = (a: number) => {
  return (context: Context) => operationByContext(a + 2, context.factor, context.operation);
};

const provideDependencies = (f: Function, context: Context) => {
  return (value: number) => f(value)(context)
}

const main = () => {
  const runnable = provideDependencies(addTwo, { operation: '*', factor: 2 })
  const res = runnable(2)
  console.log(res); // {_id: 'Exit', _tag: 'Success', value: 8}
}

main();