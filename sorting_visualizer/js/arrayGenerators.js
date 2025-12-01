import { MAX_BAR_VALUE, DISORDER_RATE } from "./constants.js";
// array generation
function generateRandom(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * MAX_BAR_VALUE) + 1);
    }

    return arr;
}

function generateAscending(size) {
    const arr = [];


    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * MAX_BAR_VALUE) + 1);
    }

    arr.sort((a, b) => a - b);

    return arr;
}


function generateDescending(size) {
    const arr = [];


    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * MAX_BAR_VALUE) + 1);
    }

    arr.sort((a, b) => b - a);

    return arr;
}

function generateNearlySorted(size) {
    const arr = generateAscending(size);


    const swaps = Math.floor(size * DISORDER_RATE);
    for (let i = 0; i < swaps; i++) {
        const a = Math.floor(Math.random() * size);
        const b = Math.floor(Math.random() * size);
        [arr[a], arr[b]] = [arr[b], arr[a]];
    }


    return arr;
}


const arrayGenerators = {
    random: generateRandom,
    ascending: generateAscending,
    descending: generateDescending,
    nearly: generateNearlySorted,
}



export { arrayGenerators, generateAscending, generateDescending, generateRandom, generateNearlySorted };