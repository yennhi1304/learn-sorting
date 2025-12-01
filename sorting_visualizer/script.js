const compareToggle = document.getElementById("compareMode");

const visualBoard = document.getElementById("visual-board");
const comparisonWrapper = document.getElementById("comparison-wrapper");

compareToggle.addEventListener("change", () => {
    if (compareToggle.checked) {
        visualBoard.style.display = "none";
        comparisonWrapper.style.display = "flex";
    } else {
        visualBoard.style.display = "flex";
        comparisonWrapper.style.display = "none";
    }
});
