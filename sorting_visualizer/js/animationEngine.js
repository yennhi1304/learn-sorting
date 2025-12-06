import { sleep } from "./untils.js";
import { state } from "./state.js";
import { MAX_BAR_VALUE } from "./constants.js";


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

        // ===========================
        // COMPARE
        // ===========================
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

        // ===========================
        // SWAP (Bubble, Selection)
        // ===========================
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

        // ===========================
        // SHIFT (Insertion sort)
        // ===========================
        case "shift": {
            const bar = barDivs[event.source];
            barDivs.splice(event.source, 1);
            barDivs.splice(event.target, 0, bar);

            board.innerHTML = "";
            barDivs.forEach(b => board.appendChild(b));
            break;
        }

        // ===========================
        // SORT MARKERS
        // ===========================
        case "sorted":
        case "permanent_sorted": {
            barDivs[event.i ?? event.index].classList.add("sorted");
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

        // ===========================
        // MERGE SORT: WRITE
        // ===========================
        case "write": {
            const bar = barDivs[event.index];
            bar.classList.add("write");

            // const maxValue = state.maxValue;  // or board.dataset.maxValue
            // const percentage = event.newValue / MAX_BAR_VALUE;

            bar.style.height = `${event.newValue / MAX_BAR_VALUE * 100}%`;
            bar.dataset.value = event.newValue;

            await sleep(state.delay);
            bar.classList.remove("write");
            break;
        }
        case "left_range": {
            for (let i = event.l; i <= event.r; i++) {
                barDivs[i].classList.add("left");
            }
            break;
        }

        // ===========================
        // RIGHT HALF
        // ===========================
        case "right_range": {
            for (let i = event.l; i <= event.r; i++) {
                barDivs[i].classList.add("right");
            }
            break;
        }
        case "clear_lr": {
            for (let i = event.l; i <= event.r; i++) {
                barDivs[i].classList.remove("left");
                barDivs[i].classList.remove("right");
            }
            break;
        }

        case "divide_lr": {
            for (const bar of barDivs) {
                bar.classList.remove("left");
                bar.classList.remove("right");
            }

            for (let i = event.left; i <= event.mid; i++) {
                barDivs[i].classList.add("left");
            }
            for (let i = event.mid + 1; i <= event.right; i++) {
                barDivs[i].classList.add("right");
            }
            await sleep(state.delay);
            break;
        }

        case "merge_end": {
            const { l, r } = event;
            for (let i = l; i <= r; i++) {
                barDivs[i].classList.remove("left");
                barDivs[i].classList.remove("right");
                barDivs[i].classList.add("sorted");
            }
            await sleep(state.delay);

            for (let i = l; i <= r; i++) {
                barDivs[i].classList.remove("sorted");
            }
            break;
        }

        case "writing": {
            for (const bar of barDivs) {
                bar.classList.remove("left");
                bar.classList.remove("right");
            }
            const { left, right } = event;
            for (let i = left; i <= right; i++) {
                barDivs[i].classList.add("writing");
            }
            break;
        }
        case "end_write": {
            const { left, right } = event;
            for (let i = left; i <= right; i++) {
                barDivs[i].classList.remove("writing");
            }
            break;
        }

    }
}





async function playAnimationInstant(event, barDivs, board) {
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

        case "shift": {
            const bar = barDivs[event.source];
            bar.classList.add("shift");

            barDivs.splice(event.source, 1);
            barDivs.splice(event.target, 0, bar);

            board.innerHTML = "";
            barDivs.forEach(b => board.appendChild(b));
            break;
        }

        case "insert_key": {
            barDivs[event.i].classList.add("key");
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

        case "sorted": {
            barDivs[event.i].classList.add("sorted");
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
        case "write": {
            const bar = barDivs[event.index];
            bar.classList.add("write");

            // const maxValue = state.maxValue;  // or board.dataset.maxValue
            // const percentage = event.newValue / MAX_BAR_VALUE;

            bar.style.height = `${event.newValue / MAX_BAR_VALUE * 100}%`;
            bar.dataset.value = event.newValue;

            break;
        }
        case "left_range": {
            for (const bar of barDivs) {
                bar.classList.remove("left");
                bar.classList.remove("right");
            }
            // await sleep(state.delay);
            for (let i = event.l; i <= event.r; i++) {
                barDivs[i].classList.add("left");
            }
            break;
        }

        // ===========================
        // RIGHT HALF
        // ===========================
        case "right_range": {
            for (let i = event.l; i <= event.r; i++) {
                barDivs[i].classList.add("right");
            }
            break;
        }
        case "clear_lr": {
            for (let i = event.l; i <= event.r; i++) {
                barDivs[i].classList.remove("left");
                barDivs[i].classList.remove("right");
            }
            break;
        }
        case "divide_lr": {
            for (const bar of barDivs) {
                bar.classList.remove("left");
                bar.classList.remove("right");
            }

            for (let i = event.left; i <= event.mid; i++) {
                barDivs[i].classList.add("left");
            }
            for (let i = event.mid + 1; i <= event.right; i++) {
                barDivs[i].classList.add("right");
            }
            break;
        }
        case "merge_end": {
            const { l, r } = event;
            for (let i = l; i <= r; i++) {
                barDivs[i].classList.remove("left");
                barDivs[i].classList.remove("right");
                barDivs[i].classList.add("sorted");
            }
            await sleep(state.delay);

            for (let i = l; i <= r; i++) {
                barDivs[i].classList.remove("sorted");
            }
            break;
        }

        case "writing": {
            for (const bar of barDivs) {
                bar.classList.remove("left");
                bar.classList.remove("right");
            }
            const { left, right } = event;
            for (let i = left; i <= right; i++) {
                barDivs[i].classList.add("writing");
            }
            break;
        }
        case "end_write": {
            const { left, right } = event;
            for (let i = left; i <= right; i++) {
                barDivs[i].classList.remove("writing");
            }
            break;
        }
    }
}





export { playAnimation, playAnimationInstant, playAnimationAuto };


