function toggleMainArea(toggle, monoBoard, dualBoard) {
    console.log(monoBoard);
    console.log(dualBoard);
    if(toggle.checked) {
        monoBoard.style.display = "none";
        dualBoard.style.display = "flex";
    } else {
        monoBoard.style.display = "flex";
        dualBoard.style.display = "none";
    }
}



export {
    toggleMainArea
}