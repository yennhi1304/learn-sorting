import { MAX_BAR_VALUE} from "./constants.js";


// toggle
function toggleMainArea(toggle, monoBoard, dualBoard) {
    if(toggle.checked) {
        monoBoard.style.display = "none";
        dualBoard.style.display = "flex";
    } else {
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

export {
    toggleMainArea,
    renderBoard
}