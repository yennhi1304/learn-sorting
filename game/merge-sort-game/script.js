let leftArr = [];
let rightArr = [];
let mergedArr = [];

// HTML references
const leftBelt = document.getElementById("leftBelt");
const rightBelt = document.getElementById("rightBelt");
const mergedRow = document.getElementById("mergedRow");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayMessage = document.getElementById("overlayMessage");

// Utility: create a random sorted array
function randomSortedArray(size) {
  const arr = [];
  let value = Math.floor(Math.random()*10);
  for (let i=0; i<size; i++) {
    value += Math.floor(Math.random()*10) + 1;
    arr.push(value);
  }
  return arr;
}

function renderBelt(beltElem, arr) {
  beltElem.innerHTML = "";
  arr.forEach((num, index) => {
    const div = document.createElement("div");
    div.className = "gift";
    div.textContent = num;

    // Only front item is clickable
    if (index === 0) {
      div.classList.add("clickable");
      div.onclick = () => selectGift(arr, num);
    } else {
      div.style.opacity = 0.4; // Not clickable
    }

    beltElem.appendChild(div);
  });
}

function selectGift(arr, num) {
  const otherArr = arr === leftArr ? rightArr : leftArr;

  // Check correctness
  if (otherArr.length && otherArr[0] < num) {
    // Wrong gift chosen
    showOverlay("❌ Wrong gift!", "That gift is not the smallest one available.");
    return;
  }

  // Correct → move gift to merged row
  mergedArr.push(num);
  arr.shift();
  renderAll();

  if (leftArr.length === 0 && rightArr.length === 0) {
    showOverlay("🎉 Perfect!", "You merged all gifts correctly!");
  }
}

function renderMergedRow() {
  mergedRow.innerHTML = "";
  mergedArr.forEach(n => {
    const div = document.createElement("div");
    div.className = "gift";
    div.textContent = n;
    mergedRow.appendChild(div);
  });
}

function renderAll() {
  renderBelt(leftBelt, leftArr);
  renderBelt(rightBelt, rightArr);
  renderMergedRow();
}

function showOverlay(title, message) {
  overlayTitle.textContent = title;
  overlayMessage.textContent = message;
  overlay.classList.remove("hidden");
}

function startGame() {
  overlay.classList.add("hidden");

  // Two sorted halves
  leftArr = randomSortedArray(4);
  rightArr = randomSortedArray(4);
  mergedArr = [];

  renderAll();
}

// Start immediately
startGame();
