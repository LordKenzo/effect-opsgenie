function aFunction() {
  console.log("Hello by Function");
}

// 👇 una funzione generator ritorna un tipo Generator
function* generatorFunction() {
  // 👈 Nota l'* subito dopo la keyword
  return "Hello by Generator Function";
}

// 👇 una normale esecuzione di una funzione
aFunction(); // 👈 output: Hello by Function
// 👇 non c'è una esecuzione della funzione
const res = generatorFunction().next();
console.log(res); // 👈 output: ???

for (let lettera of "abc") {
  console.log(lettera);
}

const array = [1, 2, 3, 4, 5];
for (let numero of array) {
  console.log(numero);
}

const iteratore: Iterator<number> = array[Symbol.iterator]();

while (true) {
  let next = iteratore.next();
  if (!next.done) {
    console.log(next.value);
  } else {
    break;
  }
}

function* stampaNumeri() {
  const array = [1, 2, 3];
  for (let numero of array) yield numero;
}
const gen = stampaNumeri();
console.log(gen.next().value); //1
console.log("Ciao");
console.log(gen.next().value); //2
console.log("Mondo!");
console.log(gen.next().value); //3

function* asyncGenerator() {
  yield new Promise((resolve) =>
    setTimeout(() => resolve("Primo valore"), 1000)
  );
  yield new Promise((resolve) =>
    setTimeout(() => resolve("Secondo valore"), 2000)
  );
  yield new Promise((resolve) =>
    setTimeout(() => resolve("Terzo valore"), 500)
  );
}

// Using the asynchronous generator function
const asyncIterator = asyncGenerator();

async function runAsyncGenerator() {
  for await (const result of asyncIterator) {
    console.log(result);
  }
}

runAsyncGenerator();
