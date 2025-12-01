



function bubbleSort(arr) {
    const events = [];
    let swapped = false;
    for (let i = 0; i < arr.length - 1; i++) {
        swapped = false;
        for (let j = 0; j < arr.length - i - 1; j++) {
            events.push({type: "compare", i: j, j: j + 1});
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
                events.push({type: "swap", i: j, j: j + 1});
            }
        }
        if (!swapped) {
            break;
        }
        // sorted element
        events.push({type: "sorted", i: arr.length - i - 1});
    }
    // sorted list
    for (let i = 0; i < arr.length; i++) {
        events.push({type: "permanent_sorted", i: i});
    }
    return events;
}


function selectionSort(arr) {
    const events = [];
    for (let i = 0; i < arr.length - 1; i++) {
        let smallest_i = i;
        events.push({type: "get_smallest", i: smallest_i});
        for (let j = i + 1; j < arr.length; j++) {
            events.push({type: "compare", i: smallest_i, j: j});
            if (arr[j] < arr[smallest_i]) {
                events.push({type: "remove_smallest", i: smallest_i});
                smallest_i = j;
                events.push({type: "get_smallest", i: smallest_i});
            }
        }
        if (smallest_i !== i) {
            [arr[smallest_i], arr[i]] = [arr[i], arr[smallest_i]];
            events.push({type: "swap", i: smallest_i, j: i});
        }
        events.push({type: "sorted", i: i});
    }

    for (let i = 0; i < arr.length; i++) {
        events.push({type: "permanent_sorted", i: i});
    }

    return events;
}



const algorithmMap = {
    bubble: bubbleSort,
    selection: selectionSort,
}



export {
    algorithmMap,
    bubbleSort,
    selectionSort,
}