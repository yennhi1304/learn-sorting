

function markedAllSort(arr, events) {
    for (let i = 0; i < arr.length; i++) {
        events.push({ type: "sorted", i: i });
    }
}



function bubbleSort(arr) {
    const events = [];
    let swapped = false;
    for (let i = 0; i < arr.length - 1; i++) {
        swapped = false;
        for (let j = 0; j < arr.length - i - 1; j++) {
            events.push({ type: "compare", i: j, j: j + 1 });
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
                events.push({ type: "swap", i: j, j: j + 1 });
            }
        }
        if (!swapped) {
            break;
        }
        // sorted element
        events.push({ type: "sorted", i: arr.length - i - 1 });
    }
    markedAllSort(arr, events);
    return events;
}


function selectionSort(arr) {
    const events = [];
    for (let i = 0; i < arr.length - 1; i++) {
        let smallest_i = i;
        for (let j = i + 1; j < arr.length; j++) {
            events.push({ type: "compare", i: smallest_i, j: j });
            if (arr[j] < arr[smallest_i]) {
                smallest_i = j;
            }
        }
        if (smallest_i !== i) {
            [arr[smallest_i], arr[i]] = [arr[i], arr[smallest_i]];
            events.push({ type: "swap", i: smallest_i, j: i });
        }
        events.push({ type: "sorted", i: i });
    }
    markedAllSort(arr, events);
    return events;
}


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

function insertionSort(arr) {
    let events = [];

    for (let i = 1; i < arr.length; i++) {

        let keyValue = arr[i];
        let j = i - 1;

        // highlight key bar
        events.push({ type: "get_key", i });

        // SHIFT PHASE
        while (j >= 0 && arr[j] > keyValue) {

            events.push({
                type: "compare",
                i: j,
                j: j + 1
            });

            arr[j + 1] = arr[j];  // shift right

            events.push({
                type: "shift_right",
                source: j,
                target: j + 1
            });

            j--;
        }

        // INSERT KEY
        arr[j + 1] = keyValue;

        events.push({
            type: "insert_key",
            i: j + 1
        });
        // events.push({
        //     type: "remove_key",
        //     i: j + 1
        // })

        events.push({
            type: "sorted",
            i: j + 1
        });
        if (j === i - 1) {
            events.push({
                type: "sorted",
                i: i - 1
            });
        }
        if (i === 1 && j === -1) {
            events.push({
                type: "sorted",
                i: 1,
            })
        }
    }
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