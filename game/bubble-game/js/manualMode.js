
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    const flakes = ['❄', '❅', '❆'];
    snowflake.textContent = flakes[Math.floor(Math.random() * flakes.length)];
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.animationDuration = (Math.random() * 3 + 5) + 's';
    snowflake.style.opacity = Math.random() * 0.4 + 0.6;
    snowflake.style.fontSize = (Math.random() * 1 + 0.8) + 'em';
    document.body.appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, 8000);
}

// Generate snowflakes
setInterval(createSnowflake, 250);
for (let i = 0; i < 15; i++) {
    setTimeout(createSnowflake, i * 150);
}

let arr = [];
let selected = null;
let i = 0;
let j = 0;
let lock = false;

const column = document.getElementById("column");
const resetBtn = document.getElementById("resetBtn");
const info = document.getElementById("info");

function generateArray() {
    arr = [];
    for (let k = 0; k < 5; k++) {
        arr.push(Math.floor(Math.random() * 90) + 5);
    }
    i = 0;
    j = arr.length - 1;
    selected = null;
    lock = false;
    updateInfo();
    render();
}

function updateInfo() {
    info.textContent = `Pass ${i + 1}: Compare indices ${4 - j} and ${5 - j}`;
}

function render() {
    column.innerHTML = "";
    arr.forEach((num, idx) => {
        const div = document.createElement("div");
        div.className = "node";
        div.dataset.index = idx;
        const img = document.createElement("img");
        img.src = "images/bubble.png";
        const span = document.createElement("span");
        span.textContent = num;
        div.appendChild(img);
        div.appendChild(span);
        div.onclick = () => selectNode(div);
        column.appendChild(div);
    });
}

function clearHighlights() {
    document.querySelectorAll(".node").forEach(n => {
        n.classList.remove("selected", "correct", "wrong");
    });
}

function selectNode(div) {
    if (lock) return;
    const idx = Number(div.dataset.index);
    const correctA = j;
    const correctB = j - 1;
    if (selected === null) {
        selected = idx;
        clearHighlights();
        div.classList.add("selected");
        return;
    }
    if (selected === idx) {
        clearHighlights();
        selected = null;
        return;
    }
    const valid =
        (selected === correctA && idx === correctB) ||
        (selected === correctB && idx === correctA);
    if (!valid) {
        doLose("wrong-pair");
        return;
    }
    pendingA = correctA;
    pendingB = correctB;
    clearHighlights();
    const nodes = document.querySelectorAll(".node");
    nodes[pendingA].classList.add("selected");
    nodes[pendingB].classList.add("selected");
    // get DOM positions
    const rectA = nodes[pendingA].getBoundingClientRect();
    const rectB = nodes[pendingB].getBoundingClientRect();

    // midpoint between both
    const midX = (rectA.left + rectB.left) / 2;
    const midY = (rectA.top + rectB.top) / 2;

    // display buttons at midpoint ABOVE bubbles
    actionButtons.style.left = midX + "px";
    actionButtons.style.top = (midY - 60) + "px";  // offset upward from bubbles
    actionButtons.classList.add("visible");
    actionButtons.style.pointerEvents = "auto";

}

function doCorrectSwap(a, b) {
    lock = true;
    clearHighlights();
    const nodes = document.querySelectorAll(".node");
    nodes[a].classList.add("correct");
    nodes[b].classList.add("correct");
    setTimeout(() => {
        if (arr[b] < arr[a]) {
            [arr[a], arr[b]] = [arr[b], arr[a]];
        }
        nextStep();
    }, 600);
}

function nextStep() {
    render();
    lock = false;
    selected = null;
    if (isSorted(arr) || i == 4) {
        info.textContent = "YOU WIN!";
        document.getElementById("column").classList.add("win");
        document.querySelector(".santa").classList.add("win");
        setTimeout(() => {
            document.getElementById("santaclaus").src = "images/santaWin.gif";
        }, 5000);
        return;
    }
    j--;
    if (j <= i) {
        i++;
        j = arr.length - 1;
    }
    updateInfo();
}

function isSorted(a) {
    for (let k = a.length - 1; k > 0; k--) {
        if (a[k] > a[k - 1]) return false;
    }
    return true;
}

function doLose(type) {
    lock = true;
    let message = "";
    switch (type) {
        case "wrong-pair":
            message = "YOU LOSE — Incorrect bubbles selected!";
            break;
        case "swap-needed":
            message = "YOU LOSE — A swap was required but you chose no swap!";
            break;
        case "no-swap-needed":
            message = "YOU LOSE — No swap was needed but you swapped!";
            break;
        default:
            message = "YOU LOSE — Try again!";
    }
    info.textContent = message;
    document.querySelectorAll(".node").forEach(n => n.classList.add("wrong"));
    document.querySelector(".shark").style.display = "block";
    setTimeout(() => {
        document.querySelector(".santa").style.visibility = "hidden";
    }, 800);

    resetBtn.style.visibility = "visible";
    setTimeout(() => {
        document.querySelector(".shark").style.display = "none";
    }, 2000);
}

resetBtn.onclick = () => {
    generateArray();
    document.querySelector(".santa").style.visibility = "visible";
    resetBtn.style.visibility = "hidden";
    actionButtons.classList.remove("visible");
};

generateArray();

swapBtn.onclick = () => {
    if (lock) return;
    const needSwap = arr[pendingA] > arr[pendingB];
    if (!needSwap) {
        doLose("no-swap-needed");
        return;
    }
    doCorrectSwap(pendingA, pendingB);
    actionButtons.classList.remove("visible");
};

noSwapBtn.onclick = () => {
    if (lock) return;
    const needSwap = arr[pendingA] > arr[pendingB];
    if (needSwap) {
        doLose("swap-needed");
        return;
    }
    doCorrectSwap(pendingA, pendingB);
    actionButtons.classList.remove("visible");
};
