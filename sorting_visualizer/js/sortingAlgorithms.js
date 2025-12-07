

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

    events.push({ type: "writing", left: left, right: right });
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
    events.push({ type: "end_write", left: left, right: right });
}


function mergeSortRec(left, right, events, array, temp) {
    if (left >= right) return;

    // Indicate start of processing a range
    // events.push({ type: "range_start", l: left, r: right });

    const mid = Math.floor((left + right) / 2);
    events.push({ type: "divide_lr", left: left, right: right, mid: mid });


    mergeSortRec(left, mid, events, array, temp);
    mergeSortRec(mid + 1, right, events, array, temp);

    // Highlight left and right halves before merging
    events.push({ type: "left_range", l: left, r: mid });
    events.push({ type: "right_range", l: mid + 1, r: right });


    merge(left, mid, right, events, array, temp);

    // Remove highlight colors after merging

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


function quickSort(arr) {
    const events = [];
    quickSortRec(arr, 0, arr.length - 1, events);

    // Mark everything sorted at the end
    for (let i = 0; i < arr.length; i++) {
        events.push({ type: "sorted", i });
    }

    return events;
}

function quickSortRec(arr, left, right, events) {
    if (left >= right) return;

    // 🔥 Highlight current recursive partitioned segment
    events.push({ type: "partition_range", left, right });

    let pivotIndex = partition(arr, left, right, events);

    // Pivot is now correctly placed
    events.push({ type: "sorted", i: pivotIndex });

    // Clear highlight before going deeper
    events.push({ type: "clear_partition_range", left, right });

    // Recursively sort left half
    if (left < pivotIndex - 1) {
        quickSortRec(arr, left, pivotIndex - 1, events);
    }

    // Recursively sort right half
    if (pivotIndex + 1 < right) {
        quickSortRec(arr, pivotIndex + 1, right, events);
    }
}

function partition(arr, left, right, events) {
    let pivot = arr[right];

    // 🔥 Highlight pivot
    events.push({ type: "get_key", i: right });

    let i = left - 1;

    for (let j = left; j < right; j++) {
        events.push({ type: "compare", i: j, j: right });

        if (arr[j] < pivot) {
            events.push({type: "smaller", i: j});
            i++;

            if (i !== j) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                events.push({ type: "swap", i, j });
            }
        } else {
            events.push({type: "larger", i: j});
        }
    }

    // Move pivot into correct position
    let pivotPos = i + 1;
    if (pivotPos !== right) {
        [arr[pivotPos], arr[right]] = [arr[right], arr[pivotPos]];
        events.push({ type: "swap", i: pivotPos, j: right });
    }

    events.push({type: "remove_sl"});

    // Remove pivot highlight
    events.push({ type: "remove_key", i: pivotPos });

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

let arr = [1, 2, 5, 6, 4];
console.log(arr);
console.log(quickSort(arr));
console.log(arr);