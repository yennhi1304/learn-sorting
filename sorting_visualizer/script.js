import { toggleMainArea, renderBoard, lockUI, unlockUI } from "./js/UIcontroller.js";
import { arrayGenerators } from "./js/arrayGenerators.js";
import { state } from "./js/state.js";
import { runDualSort, runSingleSort } from "./js/sortHandlers.js";
import { MAX_DELAY, MIN_DELAY } from "./js/constants.js";
import { playAnimationAuto, playAnimationInstant } from "./js/animationEngine.js";

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


    if (state.compareMode == "mono") {
        renderBoard(arr, monoBoard);

    } else {
        state.dual.arrayA = arr;
        state.dual.arrayB = arr;
        renderBoard(arr, boardA);
        renderBoard(arr, boardB);
    }

    resetStepUI();
});

// ----------------------- COMPARE MODE -------------------------
compareBtn.addEventListener("change", () => {
    if (compareBtn.checked) {
        // go to DUAL AUTO MODE only
        state.compareMode = "dual";
        state.autoMode = true;

        // disable step mode button
        autoBtn.classList.add("active");
        autoBtn.disabled = true;

        // hide step buttons
        nextBtn.style.display = "none";
        backBtn.style.display = "none";

        monoBoard.style.display = "none";
        dualBoard.style.display = "flex";

        renderAuto();
    } else {
        // back to MONO AUTO MODE
        state.compareMode = "mono";

        // enable step mode button again
        autoBtn.disabled = false;

        monoBoard.style.display = "flex";
        dualBoard.style.display = "none";

        renderAuto();
    }
});


// ----------------------- AUTO / STEP MODE TOGGLE ---------------
autoBtn.addEventListener("click", () => {
    // toggle
    state.autoMode = !state.autoMode;

    // STEP MODE
    if (!state.autoMode) {
        // lock comparison
        compareBtn.disabled = true;

        // ensure mono mode only
        state.compareMode = "mono";
        monoBoard.style.display = "flex";
        dualBoard.style.display = "none";

        // show next/back
        nextBtn.style.display = "inline-block";
        backBtn.style.display = "inline-block";

        autoBtn.textContent = "Auto Mode";
    }
    // AUTO MODE
    else {
        compareBtn.disabled = false;

        // hide step buttons
        nextBtn.style.display = "none";
        backBtn.style.display = "none";

        autoBtn.textContent = "Step Mode";
    }
});


// ------------------------ SORT ---------------------------------
sortBtn.addEventListener("click", async () => {
    if (state.baseArray.length === 0) {
        alert("Generate an array first!");
        return;
    }


    // AUTO MODE
    if (state.autoMode) {
        state.isSorting = true;
        lockUI(generateBtn, sortBtn, compareBtn, autoBtn);

        if (state.compareMode == "mono") {
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

        unlockUI(generateBtn, sortBtn, compareBtn, autoBtn);
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


function renderAuto() {
    if (state.autoMode) {
        // hide step buttons in auto mode
        nextBtn.style.display = "none";
        backBtn.style.display = "none";
        autoBtn.textContent = "Step Mode";
    } else {
        nextBtn.style.display = "inline-block";
        backBtn.style.display = "inline-block";
        autoBtn.textContent = "Auto Mode";
    }
}
