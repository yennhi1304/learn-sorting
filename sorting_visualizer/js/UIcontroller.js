import { MAX_BAR_VALUE} from "./constants.js";
import { state } from "./state.js";

// toggle
function toggleMainArea(toggle, monoBoard, dualBoard) {
    if(toggle.checked) {
        state.mode = "dual";
        monoBoard.style.display = "none";
        dualBoard.style.display = "flex";
    } else {
        state.mode = "mono";
        monoBoard.style.display = "flex";
        dualBoard.style.display = "none";
    }
}

function renderBoard (arr, board) {
    // clear board
    board.innerHTML = "";

    // render board
    arr.forEach(value => {
        const bar = document.createElement("div");
        bar.classList.add("bar");

        bar.style.height = `${value / MAX_BAR_VALUE * 100}%`;
        bar.style.width = `${100 / arr.length}%`;

        board.appendChild(bar);
    })
}

function lockUI(generateBtn, sortBtn) {
    console.log("Locking");
    generateBtn.disabled = true;
    sortBtn.disabled = true;
}

function unlockUI (generateBtn, sortBtn) {
    generateBtn.disabled = false;
    sortBtn.disabled = false;
}




export {
    toggleMainArea,
    renderBoard,
    lockUI,
    unlockUI,
}