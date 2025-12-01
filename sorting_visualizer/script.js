import { toggleMainArea, renderBoard, lockUI, unlockUI } from "./js/UIcontroller.js";
import { arrayGenerators } from "./js/arrayGenerators.js";
import { state } from "./js/state.js";


// DOM

// buttons
const compareToggle = document.getElementById("compareMode");
const generateBtn = document.getElementById("generateBtn");
const sortBtn = document.getElementById("sortBtn");

// selections
const arraySelection = document.getElementById("generate");
const arraySizeInput = document.getElementById("size");

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
    // render bar
    if(state.mode == "dual") {
        renderBoard(arr, boardA);
        renderBoard(arr, boardB);
        
    } else {
        renderBoard(arr, monoBoard);
    }
})
sortBtn.addEventListener("click", () => {
    lockUI(generateBtn, sortBtn);
})
