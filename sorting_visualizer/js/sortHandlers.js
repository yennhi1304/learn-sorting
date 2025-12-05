import { state } from "./state.js";
import { algorithmMap } from "./sortingAlgorithms.js";
import { playAnimation } from "./animationEngine.js";
import { renderBoard } from "./UIcontroller.js";



async function runSingleSort(monoboard, sortType) {
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
        await playAnimation(event, barDivs, monoboard);
    }
}

async function runDualSort(boardA, boardB, sortTypeA, sortTypeB) {
    let arrA = [...state.baseArray];
    let arrB = [...state.baseArray];

    renderBoard(arrA, boardA);
    renderBoard(arrB, boardB);

    const eventsA = algorithmMap[sortTypeA](arrA);
    const eventsB = algorithmMap[sortTypeB](arrB);

    const barDivsA = Array.from(boardA.children);
    const barDivsB = Array.from(boardB.children);

    async function animateA() {
        for (const event of eventsA) { 
            await playAnimation(event, barDivsA, boardA)
        }
        
    }

   async function animateB() {
        for (const event of eventsB) {
            await playAnimation(event, barDivsB, boardB)
        }
            
    }

    await Promise.all([animateA(), animateB()])
}

export {
    runSingleSort,
    runDualSort
}