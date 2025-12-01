import { sleep } from "./helpers/util.js";
import { SortingAlgorithms } from "./helpers/sortingAlgorithms.js";

const numbersBars = document.getElementById("numbersBars");
const stage = document.getElementById("stage");
const selectAlgorithm = document.getElementById("selectAlgorithm");
const generateBtn = document.getElementById("generateBtn");
const solveBtn = document.getElementById("solveBtn");
const pauseBtn = document.getElementById("pauseBtn");
const speedSlider = document.getElementById("speedSlider");

// ===== SPEED CONTROL =====
// speed = the delay per swap (lower = faster)
let speed = 200 - speedSlider.value;

speedSlider.addEventListener("input", () => {
  speed = 200 - speedSlider.value;
});

let nBars = parseInt(numbersBars.value, 10) || 10;
let barsDivs = [];

const sortingAlgorithms = new SortingAlgorithms({});
const algorithms = [
  (arr) => sortingAlgorithms.bubbleSort(arr),
  (arr) => sortingAlgorithms.selectionSort(arr),
  (arr) => sortingAlgorithms.quickSort(arr)
];

let isSorting = false;
let isPaused = false;

// ===== Pause / Resume =====
pauseBtn.addEventListener("click", () => {
  if (!isSorting) return;
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "Resume" : "Pause";
});

// ===== Helpers =====
function clearAllHighlights() {
  for (const bar of barsDivs) {
    bar.classList.remove("activate");
  }
}

async function waitWhilePaused() {
  while (isPaused) {
    await sleep(50);
  }
}

// ===== Create bars =====
function createBars(count) {
  stage.innerHTML = "";
  barsDivs = [];

  // Auto scale width for 1–500 bars
  const width = Math.max(2, Math.floor(800 / count));
  stage.style.gap = count > 200 ? "1px" : "3px";

  for (let i = 0; i < count; i++) {
    const value = Math.floor(Math.random() * 200) + 20;

    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;
    bar.style.width = `${width}px`;
    bar.dataset.value = String(value); // tooltip uses this

    stage.appendChild(bar);
    barsDivs.push(bar);
  }
}

// initial
createBars(nBars);

// ===== Swap bars visually with speed + pause =====
async function swapBars(i, j) {
  if (i === j) return;

  // remove any old red highlight
  clearAllHighlights();

  const barA = barsDivs[i];
  const barB = barsDivs[j];

  // highlight current pair
  barA.classList.add("activate");
  barB.classList.add("activate");

  // speed-controlled delay loop
  let elapsed = 0;
  while (elapsed < speed) {
    if (isPaused) await waitWhilePaused();
    await sleep(10);
    elapsed += 10;
  }

  // DO swap
  [barsDivs[i], barsDivs[j]] = [barsDivs[j], barsDivs[i]];

  // rebuild DOM
  stage.innerHTML = "";
  for (const bar of barsDivs) {
    stage.appendChild(bar);
  }
}

// ===== Solve (run algorithm & animate swaps) =====
async function solve() {
  if (isSorting) return;
  isSorting = true;
  isPaused = false;
  pauseBtn.textContent = "Pause";

  const array = barsDivs.map((bar) => parseInt(bar.dataset.value, 10));
  const algoIndex = selectAlgorithm.selectedIndex;
  const swaps = algorithms[algoIndex]([...array]); // copy array

  for (const move of swaps) {
    await waitWhilePaused();
    await swapBars(move.firstPostion, move.lastPosition);
  }

  clearAllHighlights();
  isSorting = false;
  pauseBtn.textContent = "Pause";
}

// ===== Generate new array =====
generateBtn.addEventListener("click", () => {
  const value = parseInt(numbersBars.value, 10);
  if (!Number.isFinite(value)) return;

  nBars = Math.max(1, Math.min(500, value));
  numbersBars.value = nBars;

  if (!isSorting) createBars(nBars);
});

// ===== Start sorting =====
solveBtn.addEventListener("click", () => {
  solve();
});
