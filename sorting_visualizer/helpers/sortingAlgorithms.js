const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1
};

const defaultCompare = (a, b) => {
  if (a === b) return 0;
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
};

let quickSwaps = [];

const partition = (array, left, right, compareFn) => {
  const pivot = array[Math.floor((right + left) / 2)];

  let i = left;
  let j = right;

  while (i <= j) {
    while (compareFn(array[i], pivot) === Compare.LESS_THAN) i++;
    while (compareFn(array[j], pivot) === Compare.BIGGER_THAN) j--;

    if (i < j) {
      [array[i], array[j]] = [array[j], array[i]];
      quickSwaps.push({ firstPostion: i, lastPosition: j });
      i++;
      j--;
    } else {
      if (i === j) {
        i++;
        j--;
      }
    }
  }

  return i;
};

const quick = (array, left, right, compareFn) => {
  if (left < right) {
    const index = partition(array, left, right, compareFn);

    if (left < index - 1) quick(array, left, index - 1, compareFn);
    if (index < right) quick(array, index, right, compareFn);
  }
  return array;
};

class SortingAlgorithms {
  bubbleSort(array) {
    const swaps = [];
    const len = array.length;

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          swaps.push({ firstPostion: j, lastPosition: j + 1 });
        }
      }
    }
    return swaps;
  }

  selectionSort(array) {
    const swaps = [];
    const len = array.length;

    for (let i = 0; i < len - 1; i++) {
      let min = i;
      for (let j = i + 1; j < len; j++) {
        if (array[j] < array[min]) min = j;
      }

      if (min !== i) {
        [array[min], array[i]] = [array[i], array[min]];
        swaps.push({ firstPostion: min, lastPosition: i });
      }
    }
    return swaps;
  }

  quickSort(array, compareFn = defaultCompare) {
    quickSwaps = [];
    quick(array, 0, array.length - 1, compareFn);
    return quickSwaps;
  }
}

export { SortingAlgorithms };
