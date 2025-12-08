let arr = [];
let selected = null;
let i = 0;
let j = arr.length - 1;
let lock = false;
let autoMode = true;

let pendingA = null;
let pendingB = null;

const column = document.getElementById("column");
const resetBtn = document.getElementById("resetBtn");


if (autoMode) {
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
    i = 0;  // bottom boundary index 4
    j = arr.length - 1;               // start at top index 0
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
    // reset flags
    lock = false;
    selected = null;

    // Check if already sorted or no more passes
    if (isSorted(arr) || i > arr.length - 1) {
        document.querySelectorAll(".node").forEach(n => n.classList.add("correct"));
        setTimeout(() => {
            document.getElementById("column").classList.add("win");
            document.querySelector(".santa").classList.add("win");
            setTimeout(() => {
                document.getElementById("santaclaus").src = "images/santaWin.gif";
            }, 5000);
             
        }, 2000);
        return;

    }

    // If we reached the bottom of this pass, shrink the unsorted boundary
    if (j <= i) {
        i++;                      // one new bubble is sorted
        j = arr.length - 1;       // restart from bottom
    }


    if (!autoMode) return;

    // Decide if we need to swap (descending order: biggest at top)
    const needSwap = arr[j] > arr[j - 1];

    // Render current array state (before swap)
    render();

    // Get the two DOM nodes being compared
    const nodes = document.querySelectorAll(".node");
    const B = nodes[j];
    const A = nodes[j - 1];


    //  ALWAYS highlight both bubbles during comparison
    A.classList.add("bubble-active");
    B.classList.add("bubble-active");
    // Safety check
    if (!A || !B) {
        // if something goes wrong, move to next pair
        j--;
        nextStep();
        return;
    }

    //  Extra movement animation only when swapping
    if (needSwap) {
        A.classList.add("bubble-swap-A");
        B.classList.add("bubble-swap-B");
    }

    lock = true;

    setTimeout(() => {
        if (needSwap) {
            //  swap values in the array (logical swap)
            [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
        }

        //  clear visual effects on these two nodes
        A.classList.remove("bubble-active", "bubble-swap-A");
        B.classList.remove("bubble-active", "bubble-swap-B");

        // move to next comparison pair
        j--;

        lock = false;
        nextStep();
    }, 600); // match your CSS animation duration
}

function isSorted(a) {
    // check descending top → bottom
    for (let k = a.length - 1; k > 0; k--) {
        if (a[k] < a[k - 1]) return false;
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




