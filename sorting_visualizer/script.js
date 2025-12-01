import { toggleMainArea, renderBoard } from "./js/UIcontroller.js";
import { arrayGenerators } from "./js/arrayGenerators.js";


// DOM

// buttons
const compareToggle = document.getElementById("compareMode");
const generateBtn = document.getElementById("generateBtn");


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
    const mode = compareToggle.checked ? "comparison" : "single";
    // make an array
    const arr = arrayGenerators[type](arraySize);
    // render bar
    if(mode === "comparison") {
        renderBoard(arr, boardA);
        renderBoard(arr, boardB);
        
    } else {
        renderBoard(arr, monoBoard);
    }
})
