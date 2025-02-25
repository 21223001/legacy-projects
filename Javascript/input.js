

/*
12
*/

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const num = parseInt(line, 10);
    console.log(num);  // 42
    rl.close();
});


/*
10 20 30
*/

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const numbers = line.split(' ').map(Number);
    console.log(numbers);  // [10, 20, 30]
    rl.close();
});


/*
1
2
3
4
5
*/

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const numbers = [];
rl.on('line', (line) => {
    numbers.push(Number(line));
}).on('close', () => {
    console.log(numbers);  // [1, 2, 3, 4, 5]
});



/*
1 2 3
4 5 6
7 8 9
*/

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const matrix = [];
rl.on('line', (line) => {
    matrix.push(line.split(' ').map(Number));
}).on('close', () => {
    console.log(matrix);
    // [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
});




/*
Hello World
*/

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    console.log(line);  // "Hello World"
    rl.close();
});







/*
apple
banana
cherry
*/

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const lines = [];
rl.on('line', (line) => {
    lines.push(line);
}).on('close', () => {
    console.log(lines);  // ["apple", "banana", "cherry"]
});




/*
3
dog
cat
fish
*/

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const lines = [];
rl.on('line', (line) => {
    lines.push(line);
    if (lines.length > parseInt(lines[0], 10)) {
        rl.close();
    }
}).on('close', () => {
    const N = parseInt(lines[0], 10);
    const data = lines.slice(1, N + 1);
    console.log(data);  // ["dog", "cat", "fish"]
});





