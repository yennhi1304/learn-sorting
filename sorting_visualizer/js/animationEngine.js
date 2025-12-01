import { sleep } from "./untils.js";
import { state } from "./state.js";


async function playAnimation(event, barDivs, board) {
    switch (event.type) {
        case "compare":
            {
                const barA = barDivs[event.i];
                const barB = barDivs[event.j];

                barA.classList.add("active");
                barB.classList.add("active");

                await sleep(state.delay);

                barA.classList.remove("active");
                barB.classList.remove("active");
                break;
            }
        case "swap":
            {
                const barA = barDivs[event.i];
                const barB = barDivs[event.j];

                const rectA = barA.getBoundingClientRect();
                const rectB = barB.getBoundingClientRect();

                const distance = rectB.left - rectA.left;

                barA.classList.add("swap");
                barB.classList.add("swap");


                await sleep(state.delay);


                barA.classList.remove("swap");
                barB.classList.remove("swap");
                // for show


                // actual swap
                [barDivs[event.i], barDivs[event.j]] =
                    [barDivs[event.j], barDivs[event.i]];
                board.innerHTML = "";
                barDivs.forEach((bar) => board.appendChild(bar));
                break;
            }
        case "sorted": {
            const bar = barDivs[event.i];
            bar.classList.add("sorted");
            await sleep(state.delay);
            bar.classList.remove("sorted");
            break;
        }
        case "permanent_sorted": {
            const bar = barDivs[event.i];
            bar.classList.add("sorted");
            await sleep(state.delay);
            break;
        }
        case "get_smallest": {
            const bar = barDivs[event.i];
            bar.classList.add("smallest");
            break;
        }
        case "remove_smallest": {
            const bar = barDivs[event.i];
            bar.classList.remove("smallest");
            break;
        }
        case "get_i": {
            const bar = barDivs[event.i];
            bar.classList.add("i");
            break;
        }
        case "remove_i": {
            const bar = barDivs[event.i];
            bar.classList.remove("i");
            break;
        }
        default:
            break;
    }
}


export { playAnimation };