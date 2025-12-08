let arr = [];
let selected = null;

// bubble-sort position trackers
let i = 0;        // Number of completed passes
let j = 4;        // Current comparison index (start bottom)
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
    info.textContent = `Pass ${i + 1}: Compare indices ${j} and ${j - 1}`;
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

    // first selection
    if (selected === null) {
        selected = idx;
        clearHighlights();
        div.classList.add("selected");
        return;
    }

    // clicking the same bubble again
    if (selected === idx) {
        clearHighlights();
        selected = null;
        return;
    }

    // second selection → check adjacent pair
    const pair1 = (selected === correctA && idx === correctB);
    const pair2 = (selected === correctB && idx === correctA);

    if (!pair1 && !pair2) {
        doLose();
        return;
    }

    // save pair (order-independent)
    pendingA = correctA;
    pendingB = correctB;

    // highlight BOTH bubbles
    clearHighlights();
    const nodes = document.querySelectorAll(".node");
    nodes[pendingA].classList.add("selected");
    nodes[pendingB].classList.add("selected");

    // show action buttons

    actionButtons.classList.add("visible");


}


function doCorrectSwap(a, b) {
    lock = true;

    clearHighlights();

    const nodes = document.querySelectorAll(".node");
    nodes[a].classList.add("correct");
    nodes[b].classList.add("correct");

    setTimeout(() => {
        if (arr[a] < arr[b]) {
            // NO SWAP needed in bubble sort going bottom-up
        } else {
            // swap
            [arr[a], arr[b]] = [arr[b], arr[a]];
        }

        nextStep();

    }, 600);
}

function nextStep() {
    render();
    lock = false;
    selected = null;

    j--;

    // one full pass completed
    if (j <= i) {
        i++;
        j = arr.length - 1;
    }

    // check if sorted
    if (i >= arr.length - 1) {
        info.textContent = "🎉 YOU WIN!";
        return;
    }

    updateInfo();
}

function doLose() {
    lock = true;
    info.textContent = "❌ YOU LOSE — Wrong pair selected!";
    const nodes = document.querySelectorAll(".node");
    nodes.forEach(n => n.classList.add("wrong"));
    resetBtn.style.display = "block";
}

resetBtn.onclick = () => {
    generateArray(),
        resetBtn.style.display = "none";
        actionButtons.classList.remove("visible");
};

generateArray();
swapBtn.onclick = () => {
    if (lock) return;

    const needSwap = arr[pendingA] > arr[pendingB];

    if (!needSwap) {
        // swap was wrong
        doLose();
        return;
    }

    // perform correct swap
    doCorrectSwap(pendingA, pendingB);
    actionButtons.classList.remove("visible");

};

noSwapBtn.onclick = () => {
    if (lock) return;

    const needSwap = arr[pendingA] > arr[pendingB];

    if (needSwap) {
        // user refused swap wrongly
        doLose();
        return;
    }

    // correct choice: no swap
    doCorrectSwap(pendingA, pendingB, false);
    actionButtons.classList.remove("visible");


};


