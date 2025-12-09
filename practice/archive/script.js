const generateBtn = document.getElementById("generate");
const sortBtn = document.getElementById("sort");
const stage = document.getElementById("bars");
const pauseBtn = document.getElementById("pause");

const containerHeight = 350;
const delay = 50; //ms
const arrSize = 100;

let barDivs = [];
let isSorting = false;
let isPaused = false;


async function sleep() {
    const end = Date.now() + delay;
    while (Date.now() < end) {
        // if paused, wait here
        while (isPaused) {
            await new Promise(requestAnimationFrame);
        }
        // wait at most 16ms each frame
        await new Promise(requestAnimationFrame);
    }
}

function generateBars() {
    barDivs = [];
    stage.innerHTML = "";

    for (let i = 0; i < arrSize; i++) {
        const value = Math.floor(Math.random() * 100 + 1);

        const bar = document.createElement("div");
        bar.style.height = `${(value / 100) * containerHeight}px`;
        bar.dataset.value = value;
        bar.classList.add("bar");

        stage.appendChild(bar);
        barDivs.push(bar);
    }
}

function insertionSort(array) {
    let events = [];

    for (let i = 1; i < array.length; i++) {
        let key_index = i;
        events.push({ type: "get_key", index: key_index });
        let j = i - 1;

        while (j >= 0 && array[key_index] < array[j]) {
            if (j === i - 1) {
                events.push({ type: "remove_key", index: i });
                events.push({ type: "get_key", index: j });
            }
            [array[j], array[key_index]] = [array[key_index], array[j]];
            events.push({ type: "swap", indices: [j, key_index] });
            key_index = j;
            j--;
        }
        events.push({ type: "remove_key", index: i });
    }

    return events;
}

function bubbleSort(array) {
    let events = [];
    let isSwapped = false;
    for (let i = 0; i < array.length - 1; i++) {
        isSwapped = false;
        for (let j = 0; j < array.length - i - 1; j++) {
            events.push({type: "compare", indices: [j, j + 1]});
            if (array[j] > array[j + 1]) {
                isSwapped = true;
                [array[j], array[j + 1]] = [array[j + 1], array[j]]
                events.push({type: "swap", indices: [j, j + 1]});
            }
        }
        if (!isSwapped) break;
    }
    return events;
}

function selectionSort(array) {
    let events = []
    for (let i = 0; i < array.length - 1; i++) {
        let smallest_i = i;
        events.push({type: "get_smallest", index: smallest_i});
        for (let j = i + 1; j < array.length; j++) {
            events.push({type: "compare", indices: [smallest_i, j]});
            if (array[j] < array[smallest_i]) {
                events.push({type: "remove_smallest"});
                smallest_i = j;
                events.push({type: "get_smallest", index: smallest_i});
            }
        }
        if (smallest_i !== i) {
            [array[smallest_i], array[i]] = [array[i], array[smallest_i]];
            events.push({type: "swap", indices: [smallest_i, i]});
        }
        events.push({type: "remove_smallest"});
    }
    return events;
}


async function playAnimation(event) {
    if (event.type === "compare") {
        const barA = barDivs[event.indices[0]];
        const barB = barDivs[event.indices[1]];

        // visually compare
        barA.classList.add("compare");
        barB.classList.add("compare");

        await sleep(delay);


        barA.classList.remove("compare");
        barB.classList.remove("compare");
    }
    if (event.type === "swap") {
        const barA = barDivs[event.indices[0]];
        const barB = barDivs[event.indices[1]];

        const rectA = barA.getBoundingClientRect();
        const rectB = barB.getBoundingClientRect();

        const distance = rectB.left - rectA.left;

        // hilight
        barA.classList.add("swap");
        barB.classList.add("swap");

        // animate sliding
        barA.style.transform = `translateX(${distance}px)`;
        barB.style.transform = `translateX(${-distance}px)`;

        await sleep(delay);

        // reset transform
        barA.style.transform = "";
        barB.style.transform = "";


        barA.classList.remove("swap");
        barB.classList.remove("swap");

        [barDivs[event.indices[0]], barDivs[event.indices[1]]] = [barDivs[event.indices[1]], barDivs[event.indices[0]]]
        stage.innerHTML = "";
        barDivs.forEach(bar => stage.appendChild(bar));
    }

    if (event.type === "get_key") {
        barDivs[event.index].classList.add("key");
    }
    if (event.type === "remove_key") {
        barDivs.forEach(bar => bar.classList.remove("key"));
    }
    if (event.type === "get_smallest") {
        barDivs[event.index].classList.add("smallest");
    }
    
    if (event.type === "remove_smallest") {
        barDivs.forEach(bar => bar.classList.remove("smallest"));
    }

}


async function sort() {
    isSorting = true;
    generateBtn.disabled = true;
    sortBtn.disabled = true;

    const array = barDivs.map(bar => parseInt(bar.dataset.value));
    const events = selectionSort(array);

    for (const event of events) {
        while (isPaused) {
            await new Promise(requestAnimationFrame);
        }
        await playAnimation(event);
    }
    generateBtn.disabled = false;
    sortBtn.disabled = false;
}

generateBtn.addEventListener("click", generateBars);
sortBtn.addEventListener("click", sort);
pauseBtn.addEventListener("click", () => {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "Resume" : "Pause";
})