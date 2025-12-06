import { MAX_BAR_VALUE} from "./constants.js";
import { state } from "./state.js";

// toggle
function toggleMainArea(toggle, monoBoard, dualBoard, autoBtn) {
    if(toggle.checked) {
        state.compareMode = "dual";
        monoBoard.style.display = "none";
        dualBoard.style.display = "flex"; 
    } else {
        state.compareMode = "mono";
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

function lockUI(generateBtn, sortBtn, compareToggle, autoBtn) {
    generateBtn.disabled = true;
    sortBtn.disabled = true;
    compareToggle.disabled = true;
    autoBtn.disabled = true;
}

function unlockUI (generateBtn, sortBtn, compareToggle) {
    generateBtn.disabled = false;
    sortBtn.disabled = false;
    compareToggle.disabled = false;
    autoBtn.disabled = false;
}




export {
    toggleMainArea,
    renderBoard,
    lockUI,
    unlockUI,
}