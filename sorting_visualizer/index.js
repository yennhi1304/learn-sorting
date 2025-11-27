import { sleep } from "./helpers/util.js";
import { SortingAlgorithms } from "./helpers/sortingAlgorithms.js";

const numbersBars = document.getElementById("numbersBars");
const stage = document.getElementById("stage");
const selectAlgorithm = document.getElementById("selectAlgorithm");
const generateBtn = document.getElementById("generateBtn");
const solveBtn = document.getElementById("solveBtn");
const speedSlider = document.getElementById("speedSlider");

let speed = 200 - speedSlider.value;
let nBars = parseInt(numbersBars.value, 10) || 50;
let barsDivs = [];

const sortingAlgorithms = new SortingAlgorithms({});
const algorithms = [
  (arr) => sortingAlgorithms.bubbleSort(arr),
  (arr) => sortingAlgorithms.selectionSort(arr),
  (arr) => sortingAlgorithms.quickSort(arr),
];

// Generate bars with auto-scaling width
function createBars(count) {
  stage.innerHTML = "";
  barsDivs = [];

  // Auto-scale width (min 2px)
  let width = Math.max(2, Math.floor(800 / count));

  // Reduce gap for large N
  stage.style.gap = count > 200 ? "1px" : "3px";

  for (let i = 0; i < count; i++) {
    const value = Math.floor(Math.random() * 200) + 20;

    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;
    bar.style.width = `${width}px`;
    bar.dataset.value = value.toString();

    stage.appendChild(bar);
    barsDivs.push(bar);
  }
}

// initial bars
createBars(nBars);

async function swapBars(i, j) {
  if (i === j) return;

  const barA = barsDivs[i];
  const barB = barsDivs[j];

  barA.classList.add("activate");
  barB.classList.add("activate");

  await sleep(speed);

  barA.classList.remove("activate");
  barB.classList.remove("activate");

  // Swap DOM order
  [barsDivs[i], barsDivs[j]] = [barsDivs[j], barsDivs[i]];

  stage.innerHTML = "";
  for (const bar of barsDivs) stage.appendChild(bar);
}

let isSorting = false;

async function solve() {
  if (isSorting) return;
  isSorting = true;

  const array = barsDivs.map((bar) => parseInt(bar.dataset.value));

  const algoIndex = selectAlgorithm.selectedIndex;
  const swaps = algorithms[algoIndex]([...array]);

  for (const move of swaps) {
    await swapBars(move.firstPostion, move.lastPosition);
  }

  isSorting = false;
}

// Generate new array
generateBtn.addEventListener("click", () => {
  const value = parseInt(numbersBars.value, 10);
  if (!Number.isFinite(value)) return;

  nBars = Math.max(1, Math.min(500, value));
  numbersBars.value = nBars;

  if (!isSorting) createBars(nBars);
});

// Sorting
solveBtn.addEventListener("click", solve);

// Speed control
speedSlider.addEventListener("input", () => {
  speed = 200 - speedSlider.value;
});
