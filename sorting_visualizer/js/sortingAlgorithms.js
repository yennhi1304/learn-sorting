

function markedAllSort(arr, events) {
    for (let i = 0; i < arr.length; i++) {
        events.push({ type: "sorted", i: i });
    }
}



function bubbleSort(arr) {
    const events = [];

    for (let i = 0; i < arr.length - 1; i++) {
        let swapped = false;

        for (let j = 0; j < arr.length - i - 1; j++) {
            events.push({ type: "compare", i: j, j: j + 1 });

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;

                events.push({ type: "swap", i: j, j: j + 1 });
            }
        }

        if (swapped) {
            // Last element after bubble is sorted
            events.push({ type: "sorted", i: arr.length - i - 1 });
        } else {
            // Early termination -- mark the entire remaining range sorted
            for (let k = 0; k < arr.length - i; k++) {
                events.push({ type: "sorted", i: k });
            }
            break;
        }
    }

    // Mark the very first element sorted if loop finished normally
    events.push({ type: "sorted", i: 0 });

    return events;
}



// function selectionSort(arr) {
//     const events = [];
//     for (let i = 0; i < arr.length - 1; i++) {
//         let smallest_i = i;
//         for (let j = i + 1; j < arr.length; j++) {
//             events.push({ type: "compare", i: smallest_i, j: j });
//             if (arr[j] < arr[smallest_i]) {
//                 smallest_i = j;
//             }
//         }
//         if (smallest_i !== i) {
//             [arr[smallest_i], arr[i]] = [arr[i], arr[smallest_i]];
//             events.push({ type: "swap", i: smallest_i, j: i });
//         }
//         events.push({ type: "sorted", i: i });
//     }
//     markedAllSort(arr, events);
//     return events;
// }


// function insertionSort(arr) {
//     let events = [];

//     for (let i = 1; i < arr.length; i++) {
//         let key_index = i;
//         events.push({ type: "get_key", i: key_index })
//         // mark the boundary
//         let j = i - 1;
//         while (j >= 0) {
//             events.push({type: "compare", i: key_index, j: j});
//             if (arr[key_index] < arr[j]) {
//                 [arr[j], arr[key_index]] = [arr[key_index], arr[j]];
//                 events.push({ type: "shift_left", source: key_index, target: j });
//                 key_index = j;
//                 j--;
//             } else {
//                 break;
//             }

//         }

//         events.push({ type: "remove_key", i: key_index });
//         events.push({ type: "sorted", i: j + 1 });
//         if ((i === 1 && j + 1 === 0)) {
//             events.push({ type: "sorted", i: 1 });
//         }
//         if (i === 1 && j === 0) {
//             events.push({ type: "sorted", i: 0 });
//         }
//     }

//     return events;
// }


function selectionSort(arr) {
    const events = [];

    for (let i = 0; i < arr.length - 1; i++) {

        // highlight starting smallest
        let smallest_i = i;
        events.push({ type: "get_smallest", i: smallest_i });

        for (let j = i + 1; j < arr.length; j++) {

            events.push({ type: "compare", i: smallest_i, j });

            if (arr[j] < arr[smallest_i]) {

                // highlight new smallest immediately
                events.push({
                    type: "found_new_smallest",
                    old: smallest_i,
                    new: j
                });

                smallest_i = j;
            }
        }

        // cleanup: remove ALL smallest highlights
        events.push({ type: "cleanup_smallest" });

        // perform swap if needed
        if (smallest_i !== i) {

            // highlight both bars before swapping (step mode only)
            events.push({
                type: "pre_swap",
                i: smallest_i,
                j: i
            });

            // swap logically
            [arr[smallest_i], arr[i]] = [arr[i], arr[smallest_i]];

            // swap animation event
            events.push({ type: "swap", i: smallest_i, j: i });
        }

        // mark sorted element
        events.push({ type: "permanent_sorted", i });
    }

    // final element sorted too
    events.push({ type: "permanent_sorted", i: arr.length - 1 });

    return events;
}



// function insertionSort(arr) {
//     let events = [];

//     for (let i = 1; i < arr.length; i++) {

//         let keyValue = arr[i];
//         let j = i - 1;

//         // highlight key bar
//         // events.push({ type: "get_key", i });

//         // SHIFT PHASE
//         while (j >= 0) {

//             events.push({
//                 type: "compare",
//                 i: j,
//                 j: j + 1
//             });

//             if (keyValue < arr[j]) {
//                 arr[j + 1] = arr[j];  // shift right

//             events.push({
//                 type: "shift_right",
//                 source: j,
//                 target: j + 1
//             });

//             j--;
//             } else {
//                 break;
//             }
//         }

//         // INSERT KEY
//         arr[j + 1] = keyValue;

//         // events.push({
//         //     type: "insert_key",
//         //     i: j + 1
//         // });
//         // events.push({
//         //     type: "remove_key",
//         //     i: j + 1
//         // })

//         events.push({
//             type: "sorted",
//             i: j + 1
//         });
//         if (j === i - 1) {
//             events.push({
//                 type: "sorted",
//                 i: i - 1
//             });
//         }
//         if (i === 1 && j === -1) {
//             events.push({
//                 type: "sorted",
//                 i: 1,
//             })
//         }
//     }
//     markedAllSort(arr, events);
//     return events;
// }

function insertionSort(arr) {
    const events = [];

    for (let i = 1; i < arr.length; i++) {

        let keyValue = arr[i];
        let j = i - 1;

        // Highlight the key bar
        events.push({ type: "get_key", i });

        // SHIFT PHASE
        while (j >= 0) {

            // Animation: compare key with arr[j]
            events.push({
                type: "compare",
                i: j,
                j: j + 1   // j+1 is current "hole"
            });

            if (keyValue < arr[j]) {
                arr[j + 1] = arr[j];

                events.push({
                    type: "shift_right",
                    source: j,     // element at j moves right
                    target: j + 1
                });

                j--;
            } else {
                break;
            }
        }

        // INSERT KEY
        arr[j + 1] = keyValue;

        events.push({
            type: "insert_key",
            i: j + 1,
            value: keyValue
        });

        events.push({
            type: "remove_key",
            i: j + 1
        });

        // Remove highlight from key bar

        // THE IMPORTANT PART:
        // mark the prefix [0..i] as sorted
        events.push({
            type: "sorted_range",
            start: 0,
            end: i
        });
    }

    // Mark the entire array as sorted at the end
    markedAllSort(arr, events);

    return events;
}




const algorithmMap = {
    bubble: bubbleSort,
    selection: selectionSort,
    insertion: insertionSort,
}



export {
    algorithmMap,
    bubbleSort,
    selectionSort,
    insertionSort
}