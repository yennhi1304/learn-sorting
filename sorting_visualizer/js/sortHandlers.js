import { state } from "./state.js";
import { algorithmMap } from "./sortingAlgorithms.js";
import { playAnimation, playAnimationAuto } from "./animationEngine.js";
import { renderBoard } from "./UIcontroller.js";



function collapseSortedEvents(events) {
    let i = events.length - 1;

    while (i >= 0 && (events[i].type === "sorted" || events[i].type === "permanent_sorted")) {
        i--;
    }

    // If no change, return original
    if (i === events.length - 1) return events;

    // Extract sorted indices
    const sortedIndices = [];
    for (let j = i + 1; j < events.length; j++) {
        sortedIndices.push(events[j].i);
    }

    // Build new event list
    const trimmed = events.slice(0, i + 1);

      // Add one synthetic event
    trimmed.push({
        type: "mark_all_sorted",
        indices: sortedIndices
    });


    return trimmed;

}



function runSingleSort(monoboard, sortType) {

    // copy base array
    let arr = [...state.baseArray];

    // rerender board
    renderBoard(arr, monoboard);

    // get bars
    const barDivs = Array.from(monoboard.children);

    // build events
    let events = algorithmMap[sortType](arr);

    events = collapseSortedEvents(events);
    console.log(events);

    // return without autoplay!!
    return {
        events,
        barDivs,
        board: monoboard
    };
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
            await playAnimationAuto(event, barDivsA, boardA)
        }
        
    }

   async function animateB() {
        for (const event of eventsB) {
            await playAnimationAuto(event, barDivsB, boardB)
        }
            
    }

    await Promise.all([animateA(), animateB()])
}

export {
    runSingleSort,
    runDualSort
}