let arr = [];
let i = 0;
let draggedIndex = null;
let gameOver = false;

const board = document.getElementById("line");
const message = document.getElementById("message");

// ====================== GENERATE ======================
function generateArray() {
  arr = [1, 2, 3, 4, 5];
  arr.sort(() => Math.random() - 0.5);

  i = 0;
  draggedIndex = null;
  gameOver = false;

  message.textContent = "";
  renderImages();
}

// ====================== RENDER ========================
function renderImages() {
  board.innerHTML = "";

  arr.forEach((num, idx) => {
    const block = document.createElement("div");
    block.classList.add("block");
    block.setAttribute("draggable", true);
    block.dataset.index = idx;

    const img = document.createElement("img");
    img.src = `images/${num}.png`;

    block.appendChild(img);
    board.appendChild(block);
  });
}

// ====================== MIN INDEX =====================
function indexOfMin(start) {
  let min = start;
  for (let j = start + 1; j < arr.length; j++) {
    if (arr[j] < arr[min]) min = j;
  }
  return min;
}

// ====================== DROP HANDLING =================
function handleDrop(dropIndex) {
  if (gameOver) {
    message.textContent = "✔ Sorting complete! Reset to play again.";
    return;
  }

  if (dropIndex !== i) {
    message.textContent = "❌ Drop into position " + i;
    return;
  }

  const minIndex = indexOfMin(i);

  if (draggedIndex !== minIndex) {
    message.textContent = "❌ Wrong block! Drag the smallest image.";
    return;
  }

  [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

  message.textContent = `✔ Correct! Placed image ${arr[i]}.png in slot ${i}`;

  i++;

  if (i >= arr.length - 1) {
    gameOver = true;
    message.textContent = "🎉 All images sorted perfectly!";
  }

  renderImages();
}

// ====================== DRAG EVENTS ===================
board.addEventListener("dragstart", e => {
  draggedIndex = Number(e.target.closest(".block").dataset.index);
});

board.addEventListener("dragover", e => {
  e.preventDefault();
});

board.addEventListener("drop", e => {
  const dropIndex = Number(e.target.closest(".block").dataset.index);
  handleDrop(dropIndex);
});

// ====================== INITIAL LOAD ==================
generateArray();
