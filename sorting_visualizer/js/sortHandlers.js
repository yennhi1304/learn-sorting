import { state } from "./state.js";
import { algorithmMap } from "./sortingAlgorithms.js";
import { playAnimation } from "./animationEngine.js";
import { renderBoard } from "./UIcontroller.js";


async function runSingleSort(monoboard, sortType, ms) {
    // copy from the base array
    let arr = [...state.baseArray];
    // rerender board
    renderBoard(arr, monoboard);
    // get bar divs
    const barDivs = Array.from(monoboard.children);
    // make a list of events
    const events = algorithmMap[sortType](arr);
    
    // play animation
    for (const event of events) {
        await playAnimation(event, ms, barDivs, monoboard);
    }

}


export {
    runSingleSort,
}