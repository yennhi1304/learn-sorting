import { toggleMainArea, renderBoard, lockUI, unlockUI } from "./js/UIcontroller.js";
import { arrayGenerators } from "./js/arrayGenerators.js";
import { state } from "./js/state.js";
import { runDualSort, runSingleSort } from "./js/sortHandlers.js";
import { MAX_DELAY, MIN_DELAY } from "./js/constants.js";
import { playAnimation, playAnimationAuto, playAnimationInstant } from "./js/animationEngine.js";

function clearBarStyles(barDivs) {
    for (let bar of barDivs) {
        bar.classList.remove("active");
        bar.classList.remove("swap");
        bar.classList.remove("smallest");
        bar.classList.remove("flash");
        bar.classList.remove("key");
        bar.classList.remove("shift");
        bar.classList.remove("insert");
        bar.classList.remove("write");
        // bar.classList.remove("left");
        // bar.classList.remove("right");
    }
}


// DOM ELEMENTS
const compareBtn = document.getElementById("compareMode");
const generateBtn = document.getElementById("generateBtn");
const sortBtn = document.getElementById("sortBtn");
const autoBtn = document.getElementById("autoBtn");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const resetBtn = document.getElementById("resetBtn");

// selects
const arraySelection = document.getElementById("generate");
const arraySizeInput = document.getElementById("size");
const sortTypeInput = document.getElementById("algo");
const sortTypeAInput = document.getElementById("algoA");
const sortTypeBInput = document.getElementById("algoB");
const speedSlider = document.getElementById("speed");

// boards
const monoBoard = document.getElementById("mono-board");
const dualBoard = document.getElementById("dual-board");
const boardA = document.getElementById("boardA");
const boardB = document.getElementById("boardB");

// STEP MODE STATE
let currentEvents = [];
let currentBarDivs = [];
let currentBoard = null;
let currentIndex = 0;
let prepared = false;

// RESET UI FOR STEP MODE
function resetStepUI() {
    nextBtn.disabled = true;
    backBtn.disabled = true;
    prepared = false;
    currentIndex = 0;
}

// ----------------------- GENERATE ARRAY -----------------------
generateBtn.addEventListener("click", () => {
    const type = arraySelection.value;
    const size = parseInt(arraySizeInput.value);

    const arr = arrayGenerators[type](size);
    state.maxValue = Math.max(...arr);
    state.baseArray = arr;

    if (state.compareMode) {
        state.dual.arrayA = arr;
        state.dual.arrayB = arr;
        renderBoard(arr, boardA);
        renderBoard(arr, boardB);
    } else {
        renderBoard(arr, monoBoard);
    }

    resetStepUI();
});

// ----------------------- COMPARE MODE -------------------------
compareBtn.addEventListener("change", () => {
    toggleMainArea(compareBtn, monoBoard, dualBoard);
});

// ----------------------- AUTO / STEP MODE TOGGLE ---------------
autoBtn.addEventListener("click", () => {
    const isAuto = autoBtn.classList.toggle("active");

    if (isAuto) {
        sortBtn.textContent = "Sort";
        nextBtn.style.display = "none";
        backBtn.style.display = "none";
    } else {
        sortBtn.textContent = "Prepare";
        nextBtn.style.display = "inline-block";
        backBtn.style.display = "inline-block";
    }
});

// ------------------------ SORT ---------------------------------
sortBtn.addEventListener("click", async () => {
    if (state.baseArray.length === 0) {
        alert("Generate an array first!");
        return;
    }

    const isAuto = autoBtn.classList.contains("active");

    // AUTO MODE
    if (isAuto) {
        state.isSorting = true;
        lockUI(generateBtn, sortBtn, compareBtn);

        if (!state.compareMode) {
            const sortType = sortTypeInput.value;
            const result = runSingleSort(monoBoard, sortType);

            currentEvents = result.events;
            currentBarDivs = result.barDivs;
            currentBoard = monoBoard;

            currentIndex = 0;
            prepared = true;

            await playLoopAuto();
        }
        else {
            const typeA = sortTypeAInput.value;
            const typeB = sortTypeBInput.value;
            await runDualSort(boardA, boardB, typeA, typeB);
        }

        unlockUI(generateBtn, sortBtn, compareBtn);
        state.isSorting = false;
        return;
    }

    // STEP MODE: PREPARE
    const sortType = sortTypeInput.value;
    const result = runSingleSort(monoBoard, sortType);

    currentEvents = result.events;
    currentBarDivs = result.barDivs;
    currentBoard = monoBoard;
    console.log(currentEvents);

    prepared = true;
    currentIndex = 0;

    // Update UI
    nextBtn.disabled = false;
    backBtn.disabled = true;
});

// ----------------------- AUTO PLAY LOOP -------------------------
async function playLoopAuto() {
    while (currentIndex < currentEvents.length) {
        const e = currentEvents[currentIndex];
        await playAnimationAuto(e, currentBarDivs, currentBoard);
        currentIndex++;
    }
}

// ----------------------- STEP FORWARD ---------------------------
nextBtn.addEventListener("click", () => {
    if (!prepared) return;
    if (currentIndex >= currentEvents.length) return;

    currentBoard.classList.add("paused");
    clearBarStyles(currentBarDivs);

    const e = currentEvents[currentIndex];
    playAnimationInstant(e, currentBarDivs, currentBoard);
    currentIndex++;

    backBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= currentEvents.length;
});

// ----------------------- STEP BACK ------------------------------
backBtn.addEventListener("click", () => {
    if (!prepared) return;
    if (currentIndex === 0) return;

    currentIndex--;

    // 1. Reset board to base array
    renderBoard([...state.baseArray], currentBoard);
    currentBarDivs = Array.from(currentBoard.children);

    // 2. Replay events up to (but not including) currentIndex
    for (let i = 0; i < currentIndex; i++) {
        clearBarStyles(currentBarDivs);  // 👈 move this INSIDE the loop
        playAnimationInstant(currentEvents[i], currentBarDivs, currentBoard);
    }

    // 3. Update buttons
    nextBtn.disabled = false;
    backBtn.disabled = currentIndex === 0;
});


// ----------------------- SPEED SLIDER --------------------------
speedSlider.addEventListener("input", () => {
    const t = parseInt(speedSlider.value) / 1000;
    const ease = t * t;
    state.delay = MAX_DELAY - ease * (MAX_DELAY - MIN_DELAY);
});

// ----------------------- RESET ---------------------------------
resetBtn.addEventListener("click", () => location.reload());
