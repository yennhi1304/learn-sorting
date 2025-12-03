

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
        events.push({ type: "sorted", i });
    }

    // final element sorted too
    events.push({ type: "sorted", i: arr.length - 1 });

    return events;
}


function insertionSort(arr) {
    const events = [];

    for (let i = 1; i < arr.length; i++) {

        let keyValue = arr[i];
        let j = i - 1;

        // Highlight the key bar
        events.push({ type: "get_key", i });

        // SHIFT PHASE
        while (j >= 0) {

            events.push({
                type: "compare",
                i: j,
                j: j + 1
            });

            if (keyValue < arr[j]) {
                arr[j + 1] = arr[j];

                events.push({
                    type: "shift",
                    source: j + 1,
                    target: j
                });

                j--;
            } else {
                break;
            }
        }

        // INSERT KEY → the new sorted position
        arr[j + 1] = keyValue;

        events.push({
            type: "insert_key",
            i: j + 1,
            value: keyValue
        });



        // ⭐ Mark prefix sorted *right after insertion*
        events.push({
            type: "sorted_range",
            start: 0,
            end: i
        });
    }

    // Final clean-up: mark all sorted
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