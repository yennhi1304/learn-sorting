let arr = [];
let selected = null;
let i = 0;
let j = 0;
let lock = false;
let pendingA = null;
let pendingB = null;

// 🔥 you will assign this later
let autoMode = false;

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

    // if autoMode is active, auto-start
    if (autoMode) {
        setTimeout(autoStep, 600);
    }
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
    if (autoMode) return; // 🔥 disable manual clicking in auto mode
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
    actionButtons.classList.add("visible");
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
        info.textContent = "🎉 YOU WIN!";
        return;
    }

    j--;
    if (j <= i) {
        i++;
        j = arr.length - 1;
    }
    updateInfo();

    // 🔥 auto continue
    if (autoMode) {
        setTimeout(autoStep, 500);
    }
}

function autoStep() {
    const a = j;
    const b = j - 1;

    // highlight nodes in auto mode
    clearHighlights();
    const nodes = document.querySelectorAll(".node");
    nodes[a]?.classList.add("selected");
    nodes[b]?.classList.add("selected");

    setTimeout(() => {
        if (arr[a] > arr[b]) {
            doCorrectSwap(a, b);
        } else {
            lock = true;
            setTimeout(nextStep, 400);
        }
    }, 500);
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
            message = "❌ YOU LOSE — Incorrect bubbles selected!";
            break;
        case "swap-needed":
            message = "❌ YOU LOSE — A swap was required but you chose no swap!";
            break;
        case "no-swap-needed":
            message = "❌ YOU LOSE — No swap was needed but you swapped!";
            break;
        default:
            message = "❌ YOU LOSE — Try again!";
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

// manual buttons still exist but ignored in autoMode
swapBtn.onclick = () => {
    if (lock || autoMode) return;
    const needSwap = arr[pendingA] > arr[pendingB];
    if (!needSwap) {
        doLose("no-swap-needed");
        return;
    }
    doCorrectSwap(pendingA, pendingB);
    actionButtons.classList.remove("visible");
};

noSwapBtn.onclick = () => {
    if (lock || autoMode) return;
    const needSwap = arr[pendingA] > arr[pendingB];
    if (needSwap) {
        doLose("swap-needed");
        return;
    }
    doCorrectSwap(pendingA, pendingB);
    actionButtons.classList.remove("visible");
};

// initial start
generateArray();






