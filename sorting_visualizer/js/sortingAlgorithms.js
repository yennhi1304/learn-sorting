

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

function merge(left, mid, right, events, array, temp) {
    let i = left;
    let j = mid + 1;
    let k = left;

    // Compare only — fill temp without writing to main array
    while (i <= mid && j <= right) {
        events.push({
            type: "compare",
            i,
            j,
        });

        if (array[i] <= array[j]) {
            temp[k++] = array[i++];
        } else {
            temp[k++] = array[j++];
        }
    }

    // Remaining left half
    while (i <= mid) {
        temp[k++] = array[i++];
    }

    // Remaining right half
    while (j <= right) {
        temp[k++] = array[j++];
    }

    events.push({type: "clear_lr", l: left, r: right});
    // 👇 Now finally write all merged values back to `array`
    // and push write events **in order**
    for (let x = left; x <= right; x++) {
        events.push({
            type: "write",
            index: x,
            newValue: temp[x]
        });
        array[x] = temp[x];
    }
}


function mergeSortRec(left, right, events, array, temp) {
    if (left >= right) return;

    // Indicate start of processing a range
    // events.push({ type: "range_start", l: left, r: right });

    const mid = Math.floor((left + right) / 2);


    mergeSortRec(left, mid, events, array, temp);
    mergeSortRec(mid + 1, right, events, array, temp);

    // Highlight left and right halves before merging
    events.push({ type: "left_range", l: left, r: mid });
    events.push({ type: "right_range", l: mid + 1, r: right });


    merge(left, mid, right, events, array, temp);

    // Remove highlight colors after merging
    events.push({ type: "clear_lr", l: left, r: right});

    // Mark end of processing this range
    // events.push({ type: "range_end", l: left, r: right });
}

function mergeSort(array) {
    let events = [];
    let temp = [...array];

    mergeSortRec(0, array.length - 1, events, array, temp);

    // Final global sorted highlight
    markedAllSort(array, events);

    return events;
}


function quickSort(array) {
    let events = [];
    let n = array.length;

    quickSortRec(array, 0, n - 1, events);

    // Final permanent sorted highlight
    for (let i = 0; i < n; i++) {
        events.push({ type: "permanent_sort", index: i });
    }

    return events;
}


function quickSortRec(arr, left, right, events) {
    if (left >= right) return;

    // Start highlighting this range
    events.push({ type: "range_start", l: left, r: right });

    let pivotIndex = partition(arr, left, right, events);

    // Highlight left half
    events.push({ type: "left_range", l: left, r: pivotIndex - 1 });
    quickSortRec(arr, left, pivotIndex - 1, events);
    events.push({ type: "clear_lr", l: left, r: pivotIndex - 1 });

    // Highlight right half
    events.push({ type: "right_range", l: pivotIndex + 1, r: right });
    quickSortRec(arr, pivotIndex + 1, right, events);
    events.push({ type: "clear_lr", l: pivotIndex + 1, r: right });

    // End highlighting this range
    events.push({ type: "range_end", l: left, r: right });
}


function partition(arr, left, right, events) {
    let pivot = arr[right];    // pick rightmost pivot
    let i = left - 1;

    // highlight pivot explicitly
    events.push({ type: "right_range", l: right, r: right });

    for (let j = left; j < right; j++) {
        // comparison event
        events.push({ type: "compare", indices: [j, right] });

        if (arr[j] < pivot) {
            i++;

            if (i !== j) {
                // logical swap
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;

                // convert the swap to two writes
                events.push({ type: "write", index: i, newValue: arr[i] });
                events.push({ type: "write", index: j, newValue: arr[j] });
            }
        }
    }

    // swap pivot into correct place
    let pivotPos = i + 1;

    if (pivotPos !== right) {
        let temp = arr[pivotPos];
        arr[pivotPos] = arr[right];
        arr[right] = temp;

        // pivot swap becomes two writes
        events.push({ type: "write", index: pivotPos, newValue: arr[pivotPos] });
        events.push({ type: "write", index: right, newValue: arr[right] });
    }

    // remove pivot highlight
    events.push({ type: "clear_lr", l: right, r: right });

    return pivotPos;
}









const algorithmMap = {
    bubble: bubbleSort,
    selection: selectionSort,
    insertion: insertionSort,
    merge: mergeSort,
    quick: quickSort

}



export {
    algorithmMap,
    bubbleSort,
    selectionSort,
    insertionSort,
    mergeSort,
    quickSort
}

let array = [1, 3, 2, 19, 5];

console.log(array);
console.log(mergeSort(array));
console.log(array);