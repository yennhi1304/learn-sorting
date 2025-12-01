import { sleep } from "./untils.js";


async function playAnimation(event, ms, barDivs, board) {
    switch (event.type) {
        case "comparison":
            {
                const barA = barDivs[event.i];
                const barB = barDivs[event.j];

                barA.classList.add("active");
                barB.classList.add("active");

                await sleep(ms);

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

                barA.classList.add("active");
                barB.classList.add("active");

                // for show
                barA.style.transform = `translateX(${distance}px)`;
                barB.style.transform = `translateX(${-distance}px)`;

                await sleep();

                barA.style.transform = "";
                barB.style.transform = "";

                barA.classList.remove("active");
                barB.classList.remove("active");
                // for show


                // actual swap
                [barDivs[event.i], barDivs[event.j]] =
                    [barDivs[event.j], barDivs[event.i]];
                board.innerHTML = "";
                barDivs.forEach((bar) => board.appendChild(bar));
                break;
            }
        default:
            break;
    }
}


export {playAnimation};