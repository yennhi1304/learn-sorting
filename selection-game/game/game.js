let arr = [];
const correct = [...arr].sort((a, b) => a - b);
let i = 0;
let draggedIndex = null;
let gameOver = false;   // ⬅ NEW



const lineDiv = document.getElementById("line");
const message = document.getElementById("message");

function render() {
  lineDiv.innerHTML = "";

  for (let index = 0; index < arr.length; index++) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.index = index;

    if (index === i) slot.classList.add("highlight-slot");

    const c = document.createElement("div");
    c.className = "customer";
    c.textContent = arr[index] + " cm";
    c.draggable = !gameOver;


    c.addEventListener("dragstart", () => (draggedIndex = index));

    slot.addEventListener("dragover", (e) => e.preventDefault());
    slot.addEventListener("drop", () => handleDrop(index));

    slot.appendChild(c);
    lineDiv.appendChild(slot);
  }
}

function indexOfMin(start) {
  let min = start;
  for (let j = start + 1; j < arr.length; j++) {
    if (arr[j] < arr[min]) min = j;
  }
  return min;
}

function handleDrop(dropIndex) {

  if (gameOver) {
    message.textContent = "✔ Sorting complete! Press Reset to play again.";
    return;
  }

  if (dropIndex !== i) {
    message.textContent = "❌ Drop into position " + i;
    return;
  }

  const minIndex = indexOfMin(i);

  if (draggedIndex !== minIndex) {
    message.textContent = "❌ That's not the smallest!";
    return;
  }

  [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  message.textContent = `✔ Correct! ${arr[i]} placed at position ${i}`;

  i++;

  // ⬅ End condition
  if (i >= arr.length - 1) {
    gameOver = true;  // ⬅ LOCK THE GAME
    message.textContent += " — 🎉 Sorting complete! Press Reset to play again.";
  }

  render();
}

function generateArray() {
    arr = [];
    for (let k = 0; k < 5; k++) {
        arr.push(Math.floor(Math.random() * 90) + 5);
    }

    i = 0;
    draggedIndex = null;
    gameOver = false;

    message.textContent = "";
    render();
}



render();
