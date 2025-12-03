import { sleep } from "./untils.js";
import { state } from "./state.js";


// async function playAnimation(event, barDivs, board) {
//     switch (event.type) {
//         case "compare":
//             {
//                 const barA = barDivs[event.i];
//                 const barB = barDivs[event.j];

//                 barA.classList.add("active");
//                 barB.classList.add("active");

//                 await sleep(state.delay);

//                 barA.classList.remove("active");
//                 barB.classList.remove("active");
//                 break;
//             }
//         case "swap":
//             {
//                 const barA = barDivs[event.i];
//                 const barB = barDivs[event.j];

//                 const rectA = barA.getBoundingClientRect();
//                 const rectB = barB.getBoundingClientRect();

//                 const distance = rectB.left - rectA.left;

//                 barA.classList.add("swap");
//                 barB.classList.add("swap");

//                 barA.style.transform = `translateX(${distance}px)`;
//                 barB.style.transform = `translateX(${-distance}px)`;


//                 await sleep(state.delay);

//                 barA.style.transform = "";
//                 barB.style.transform = "";


//                 barA.classList.remove("swap");
//                 barB.classList.remove("swap");
//                 // for show


//                 // actual swap
//                 [barDivs[event.i], barDivs[event.j]] =
//                     [barDivs[event.j], barDivs[event.i]];
//                 board.innerHTML = "";
//                 barDivs.forEach((bar) => board.appendChild(bar));
//                 break;
//             }
//         case "permanent_sorted": {
//             const bar = barDivs[event.i];
//             bar.classList.add("sorted");
//             await sleep(state.delay);
//             break;
//         }
//         case "sorted": {
//             const bar = barDivs[event.i];
//             bar.classList.add("sorted");
//             break;
//         }
//         case "get_smallest": {
//             const bar = barDivs[event.i];
//             bar.classList.add("smallest");
//             break;
//         }
//         case "remove_smallest": {
//             const bar = barDivs[event.i];
//             bar.classList.remove("smallest");
//             break;
//         }
//         case "get_key": {
//             const bar = barDivs[event.i];
//             bar.classList.add("active");
//             await sleep(state.delay);
//             bar.classList.remove("active");
//             break;
//         }

//         case "remove_key": {
//             const bar = barDivs[event.i];
//             bar.classList.remove("key");
//             break;
//         }
//         case "shift_right": {
//             const bar = barDivs[event.source];

//             // bar.classList.add("shift");
//             // await sleep(state.delay);
//             // bar.classList.remove("shift");

//             // SHIFT (not swap!)
//             barDivs.splice(event.source, 1);      // remove original
//             barDivs.splice(event.target, 0, bar); // insert at right spot

//             // re-render
//             board.innerHTML = "";
//             barDivs.forEach(b => board.appendChild(b));

//             break;
//         }
//         case "insert_key": {
//             const bar = barDivs[event.i];
//             bar.classList.add("active");
//             await sleep(state.delay);
//             bar.classList.remove("active");
//             break;
//         }
//         case "flash": {
//             const bar = barDivs[event.i];
//             bar.classList.add("flash");
//             await sleep(state.delay);
//             bar.classList.remove("flash");
//             break;
//         }
//         case "mark_all_sorted": {
//             for (let idx of event.indices) {
//                 const bar = barDivs[idx];
//                 bar.classList.add("sorted");
//                 await sleep(state.delay * 0.3); // optional effect
//             }
//             break;
//         }
//         default:
//             break;
//     }
// }

async function playAnimation(event, barDivs, board) {
    switch (event.type) {

        // ---------------------------------------
        case "compare": {
            const a = barDivs[event.i];
            const b = barDivs[event.j];

            a.classList.add("active");
            b.classList.add("active");
            await sleep(state.delay);
            a.classList.remove("active");
            b.classList.remove("active");
            break;
        }

        // ---------------------------------------
        case "get_key": {
            const bar = barDivs[event.i];
            bar.classList.add("key");
            await sleep(state.delay * 0.5);
            break;
        }

        case "remove_key": {
            const bar = barDivs[event.i];
            bar.classList.remove("key");
            bar.classList.remove("insert");
            break;
        }

        // ---------------------------------------
        case "shift_right": {
            const bar = barDivs[event.source];

            bar.classList.add("shift");

            // DOM rearrangement
            barDivs.splice(event.source, 1);
            barDivs.splice(event.target, 0, bar);

            board.innerHTML = "";
            barDivs.forEach(b => board.appendChild(b));

            await sleep(state.delay);

            bar.classList.remove("shift");
            break;
        }

        // ---------------------------------------
        case "insert_key": {
            const bar = barDivs[event.i];
            bar.classList.add("insert");
            await sleep(state.delay);
            break;
        }

        // ---------------------------------------
        case "swap": {
            const barA = barDivs[event.i];
            const barB = barDivs[event.j];

            barA.classList.add("swap");
            barB.classList.add("swap");

            const rectA = barA.getBoundingClientRect();
            const rectB = barB.getBoundingClientRect();
            const distance = rectB.left - rectA.left;

            barA.style.transform = `translateX(${distance}px)`;
            barB.style.transform = `translateX(${-distance}px)`;

            await sleep(state.delay);

            barA.style.transform = "";
            barB.style.transform = "";

            barA.classList.remove("swap");
            barB.classList.remove("swap");

            [barDivs[event.i], barDivs[event.j]] =
                [barDivs[event.j], barDivs[event.i]];
            board.innerHTML = "";
            barDivs.forEach(bar => board.appendChild(bar));
            break;
        }

        // ---------------------------------------
        case "permanent_sorted":
        case "sorted": {
            barDivs[event.i].classList.add("sorted");
            await sleep(state.delay * 0.3);
            break;
        }

        // ---------------------------------------
        case "get_smallest": {
            barDivs[event.i].classList.add("smallest");
            break;
        }

        case "remove_smallest": {
            barDivs[event.i].classList.remove("smallest");
            break;
        }

        // ---------------------------------------
        case "flash": {
            const bar = barDivs[event.i];
            bar.classList.add("flash");
            await sleep(state.delay * 0.3);
            bar.classList.remove("flash");
            break;
        }

        // ---------------------------------------
        case "mark_all_sorted": {
            for (let idx of event.indices) {
                barDivs[idx].classList.add("sorted");
                await sleep(state.delay * 0.1);
            }
            break;
        }
        case "sorted_range": {
            for (let k = event.start; k <= event.end; k++) {
                barDivs[k].classList.add("sorted");
                // await sleep(state.delay * 0.1); // optional fade
            }
            break;
        }

    }
}


async function playAnimationAuto(event, barDivs, board) {
    switch (event.type) {
        case "compare": {
            const a = barDivs[event.i];
            const b = barDivs[event.j];

            a.classList.add("active");
            b.classList.add("active");
            await sleep(state.delay);
            a.classList.remove("active");
            b.classList.remove("active");
            break;
        }

        case "swap": {
            const A = barDivs[event.i];
            const B = barDivs[event.j];

            A.classList.add("swap");
            B.classList.add("swap");

            const rectA = A.getBoundingClientRect();
            const rectB = B.getBoundingClientRect();
            const dist = rectB.left - rectA.left;

            A.style.transform = `translateX(${dist}px)`;
            B.style.transform = `translateX(${-dist}px)`;

            await sleep(state.delay);

            A.style.transform = "";
            B.style.transform = "";

            A.classList.remove("swap");
            B.classList.remove("swap");

            [barDivs[event.i], barDivs[event.j]] =
                [barDivs[event.j], barDivs[event.i]];

            board.innerHTML = "";
            barDivs.forEach(b => board.appendChild(b));
            break;
        }

        case "shift_right": {
            const bar = barDivs[event.source];

            // move bars instantly without colors
            barDivs.splice(event.source, 1);
            barDivs.splice(event.target, 0, bar);

            board.innerHTML = "";
            barDivs.forEach(b => board.appendChild(b));
            break;
        }

        case "sorted":
        case "permanent_sorted": {
            barDivs[event.i].classList.add("sorted");
            break;
        }

        case "sorted_range": {
            for (let k = event.start; k <= event.end; k++) {
                barDivs[k].classList.add("sorted");
            }
            break;
        }

        case "mark_all_sorted": {
            for (let idx of event.indices) {
                barDivs[idx].classList.add("sorted");
                await sleep(state.delay * 0.1);
            }
            break;
        }

        // ignore compare, key, smallest, flash, insert, etc.
    }
}




function playAnimationInstant(event, barDivs, board) {
    console.log(event);
    switch (event.type) {

        case "compare": {
            barDivs[event.i].classList.add("active");
            barDivs[event.j].classList.add("active");
            break;
        }

        case "get_key": {
            barDivs[event.i].classList.add("key");
            break;
        }

        case "remove_key": {
            barDivs[event.i].classList.remove("key");
            barDivs[event.i].classList.remove("insert");
            break;
        }

        case "shift_right": {
            const bar = barDivs[event.source];
            bar.classList.add("shift");

            barDivs.splice(event.source, 1);
            barDivs.splice(event.target, 0, bar);

            board.innerHTML = "";
            barDivs.forEach(b => board.appendChild(b));
            break;
        }

        case "insert_key": {
            barDivs[event.i].classList.add("insert");
            break;
        }

        case "swap": {
            const barA = barDivs[event.i];
            const barB = barDivs[event.j];

            barA.classList.add("swap");
            barB.classList.add("swap");

            [barDivs[event.i], barDivs[event.j]] =
                [barDivs[event.j], barDivs[event.i]];

            board.innerHTML = "";
            barDivs.forEach(b => board.appendChild(b));
            break;
        }

        case "get_smallest": {
            barDivs[event.i].classList.add("smallest");
            break;
        }

        case "remove_smallest": {
            barDivs[event.i].classList.remove("smallest");
            break;
        }

        case "sorted":
        case "permanent_sorted": {
            barDivs[event.i].classList.add("sorted");
            break;
        }

        case "flash": {
            barDivs[event.i].classList.add("flash");
            break;
        }

        case "mark_all_sorted": {
            for (let idx of event.indices) {
                barDivs[idx].classList.add("sorted");
            }
            break;
        }
        case "sorted_range": {
            for (let k = event.start; k <= event.end; k++) {
                barDivs[k].classList.add("sorted");
            }
            break;
        }

        case "pre_swap": {
            barDivs[event.i].classList.add("swap");
            barDivs[event.j].classList.add("swap");
            break;
        }
        case "found_new_smallest": {
            // keep old smallest highlighted
            barDivs[event.new].classList.add("smallest");
            break;
        }
    }
}





export { playAnimation, playAnimationInstant, playAnimationAuto };