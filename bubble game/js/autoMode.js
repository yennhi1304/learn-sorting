let arr = [];
let selected = null;
let i = 0;
let j = 0;
let lock = false;
let autoMode = false;

let pendingA = null;
let pendingB = null;

const column = document.getElementById("column");
const resetBtn = document.getElementById("resetBtn");


if (autoMode)
{
    generateArray();
}

else {
    doLose();
}

function generateArray() {
    arr = [];
    for (let k = 0; k < 5; k++) {
        arr.push(Math.floor(Math.random() * 90) + 5);
    }

    // full range top → bottom
    i = arr.length - 1;  // bottom boundary index 4
    j = 0;               // start at top index 0
    selected = null;
    lock = false;

    render();

    if (autoMode) nextStep();
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


function nextStep() {
    render();
    lock = false;
    selected = null;

    if (isSorted(arr) || i <= 0) {
        document.getElementById("column").classList.add("win");
        document.querySelector(".santa").classList.add("win");
        return;
    }

    j++;

    // reach bottom → shrink bottom boundary
    if (j >= i) {
        i--;
        j = 0;
    }

    if (autoMode) {
        const needSwap = arr[j] < arr[j + 1]; // biggest should go up
        lock = true;
        setTimeout(() => {
            if (needSwap) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
            lock = false;
            nextStep();
        }, 1000);
        return;
    }
}

function isSorted(a) {
    // check descending top → bottom
    for (let k = 0; k < a.length - 1; k++) {
        if (a[k] < a[k + 1]) return false;
    }
    return true;
}



function doLose() {
    lock = true;
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
    
};




