import { toggleMainArea, generateAscending, generateDescending, generateNearlySorted } from "./UIcontroller.js";

const compareToggle = document.getElementById("compareMode");

const monoBoard = document.getElementById("mono-board");
const dualBoard = document.getElementById("dual-board");

compareToggle.addEventListener("change", () => {
    toggleMainArea(compareToggle, monoBoard, dualBoard)
});

let arr = generateNearlySorted(10);
