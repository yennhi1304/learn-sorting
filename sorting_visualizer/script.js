import { toggleMainArea, renderBoard, lockUI, unlockUI} from "./js/UIcontroller.js";
import { arrayGenerators } from "./js/arrayGenerators.js";
import { state } from "./js/state.js";
import { runSingleSort } from "./js/sortHandlers.js";
import { MAX_DELAY, MIN_DELAY } from "./js/constants.js";


// DOM

// buttons
const compareToggle = document.getElementById("compareMode");
const generateBtn = document.getElementById("generateBtn");
const sortBtn = document.getElementById("sortBtn");

// selections
const arraySelection = document.getElementById("generate");
const arraySizeInput = document.getElementById("size");
const sortTypeInput = document.getElementById("algo");
const speedSlider = document.getElementById("speed");
// boards
const monoBoard = document.getElementById("mono-board");
const dualBoard = document.getElementById("dual-board");
const boardA = document.getElementById("boardA");
const boardB = document.getElementById("boardB");



// event listeners
compareToggle.addEventListener("change", () => {
    toggleMainArea(compareToggle, monoBoard, dualBoard)
});
generateBtn.addEventListener("click", () => {
    // preparation
    const type = arraySelection.value;
    const arraySize = parseInt(arraySizeInput.value);
    // make an array
    const arr = arrayGenerators[type](arraySize);
    state.baseArray = arr;
    // render bar and set the state accordingly
    if (state.mode == "dual") {
        state.dual.arrayA = arr;
        state.dual.arrayB = arr;
        renderBoard(arr, boardA);
        renderBoard(arr, boardB);

    } else {
        renderBoard(arr, monoBoard);
    }
})
sortBtn.addEventListener("click", async () => {

    const sortType = sortTypeInput.value;
    // guard rail
    if (state.isSorting) return;

    if (state.baseArray.length === 0) {
        alert("No array yet. Create some");
        return;
    }

    state.isSorting = true;
    lockUI(generateBtn, sortBtn, compareToggle);
    

    await runSingleSort(monoBoard, sortType);


    // remove guard rail
    unlockUI(generateBtn, sortBtn, compareToggle);
    state.isSorting = false;
})

speedSlider.addEventListener("input", () => {
    const sliderValue = parseInt(speedSlider.value);
    const t = sliderValue / 1000;
    const ease = t * t;
    state.delay = MAX_DELAY - ease * (MAX_DELAY - MIN_DELAY);
})
