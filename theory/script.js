/* ================= DARK MODE TOGGLE ================= */
const toggleCheckbox = document.querySelector(".switch input");
const nav = document.querySelector(".navbar");

if (toggleCheckbox) {
  toggleCheckbox.addEventListener("change", () => {
    const on = toggleCheckbox.checked;
    document.body.classList.toggle("dark", on);
    nav.classList.toggle("dark", on);
  });
}

/* ================= WHEEL SLICE HOVER LAYERING ================= */
const sliceLayer = document.getElementById("slice-layer");

if (sliceLayer) {
  const slices = sliceLayer.querySelectorAll(".slice");

  slices.forEach((slice, index) => {
    slice.dataset.originalIndex = String(index);

    slice.addEventListener("mouseenter", () => {
      // bring hovered slice to the top within the slice group
      sliceLayer.appendChild(slice);
    });

    slice.addEventListener("mouseleave", () => {
      // restore original position to keep order pretty
      const idx = Number(slice.dataset.originalIndex);
      const current = sliceLayer.children[idx];
      if (current) {
        sliceLayer.insertBefore(slice, current);
      }
    });
  });
}

/* ================= FULLSCREEN IMAGE VIEWER ================= */
const viewer = document.getElementById("imageViewer");
const viewerImg = document.getElementById("viewerImg");

// event delegation – works for dynamically injected images
document.addEventListener("click", (e) => {
  const target = e.target;

  if (target.classList && (target.classList.contains("zoom-img") || target.classList.contains("full-img"))) {
    viewerImg.src = target.src;
    viewerCaption.textContent = target.alt || "";   // ⭐ ADD THIS
    viewer.classList.add("active");
  }

});

// click anywhere on overlay to close
if (viewer) {
  viewer.addEventListener("click", () => {
    viewer.classList.remove("active");
  });
}

/* ================= LESSON DATA ================= */
const lessons = {
  selectionSort: {
    title: "Selection Sort",
    complexityCurves: ["O2"],
    html: `
      <div class="section-block">
        <p>
          Selection Sort scans the array to find the smallest value and moves it to the front.
          It repeats this for all positions.
        </p>

        <h3>How it works</h3>
        <ul>
          <li>Find minimum.</li>
          <li>Swap with first unsorted position.</li>
          <li>Repeat.</li>
        </ul>
      </div>

      <div class="section-block">
        <h3>First scan</h3>
        <div class="image-row">
          <img src="images/selection/step1.png" class="zoom-img" alt="Select first element as minimum">
          <img src="images/selection/step2.png" class="zoom-img" alt="Compare minimum with remaining elements">
          <img src="images/selection/step3.png" class="zoom-img" alt="Swap first with minimum">
        </div>
      </div>

      <div class="section-block">
        <h3>Iterations</h3>
        <div class="image-row">
          <img src="images/selection/iter1.png" class="zoom-img" alt="First iteration">
          <img src="images/selection/iter2.png" class="zoom-img" alt="Second iteration">
          <img src="images/selection/iter3.png" class="zoom-img" alt="Third iteration">
        </div>
      </div>

      <div class="section-block">
        <div class="image-row">
          <img src="images/selection/iter4.png" class="zoom-img" alt="Fourth iteration">
        </div>
      </div>

      <div class="section-block">
        <h3>Time Complexity</h3>
        <ul>
          <li><b>Best-case:</b> O(n²)</li>
          <li><b>Average-case:</b> O(n²)</li>
          <li><b>Worst-case:</b> O(n²)</li>
        </ul>
      </div>
      <!-- interactive complexity panel inside lesson -->
    <div class="section-block">
      <h3>Try it yourself: Selection Sort complexity</h3>

      <div class="complexity-panel" data-algo="selectionSort">
        <div class="complexity-controls">
          <label>Array size:</label>
          <input type="range" class="complexity-slider" min="10" max="500" value="50">
          <span class="complexity-slider-value">50</span>

          <button class="complexity-run">Run</button>
          <button class="complexity-clear">Clear</button>
        </div>

        <p>Operations: <span class="complexity-ops">0</span></p>

        <canvas class="complexity-canvas"></canvas>
      </div>
    </div>
    `
  },

  bubbleSort: {
    title: "Bubble Sort",
    complexityCurves: ["O2"],
    html: `
    <div class="section-block">
      <p>
        Bubble sort compares two adjacent elements and swaps them if they are in the wrong order.
        Just like air bubbles rising to the surface, the largest element moves to the end of the array after each pass.
      </p>

      <h3>How it works</h3>
      <ul>
        <li>Go through the array one value at a time.</li>
        <li>For each value, compare it with the next one.</li>
        <li>If the first value is larger, swap the two elements.</li>
        <li>Repeat the whole pass as many times as there are values.</li>
      </ul>
    </div>

    <div class="section-block">
      <h3>Example passes</h3>
      <div class="image-row">
        <img src="images/bubble/b_step0.png" class="zoom-img" alt="Step 0 – Compare the Adjacent Elements">
      </div>
    </div>

    <div class="section-block">
      <div class="image-row">
        <img src="images/bubble/b_step1.png" class="zoom-img" alt="Step 1 – Put the largest element at the end">
      </div>
    </div>

    <div class="section-block">
      <div class="image-row">
        <img src="images/bubble/b_step2.png" class="zoom-img" alt="Step 2 – Compare the adjacent elements">
      </div>
    </div>

    <div class="section-block">
      <div class="image-row">
        <img src="images/bubble/b_step3.png" class="zoom-img" alt="Step 3 – The array is sorted if all elements are kept in the right order">
      </div>
    </div>

    <div class="section-block">
      <h3>Time Complexity</h3>
      <ul>
        <li><b>Best-case:</b> O(n)</li>
        <li><b>Average-case:</b> O(n²)</li>
        <li><b>Worst-case:</b> O(n²)</li>
      </ul>
    </div>

    <!-- interactive complexity panel inside lesson -->
    <div class="section-block">
      <h3>Try it yourself: Bubble Sort complexity</h3>

      <div class="complexity-panel" data-algo="bubbleSort">
        <div class="complexity-controls">
          <label>Array size:</label>
          <input type="range" class="complexity-slider" min="10" max="500" value="50">
          <span class="complexity-slider-value">50</span>

          <button class="complexity-run">Run</button>
          <button class="complexity-clear">Clear</button>
        </div>

        <p>Operations: <span class="complexity-ops">0</span></p>

        <canvas class="complexity-canvas"></canvas>
      </div>
    </div>
  `
  },


  insertionSort: {
    title: "Insertion Sort",
    complexityCurves: ["O2"],
    html: `
      <p>
        The Insertion Sort algorithm uses one part of the array to hold the sorted values, 
        and the other part of the array to hold the values that are not sorted yet.
      </p>

      <h3>Initial Array</h3>
      <div class="section-block">
        <div class="image-row">
          <img src="images/insertion/initial.png" 
               class="zoom-img" 
               alt="Initial array">
        </div>
      </div>

      <h3>Step 1</h3>
      <div class="section-block">
        <div class="image-row">
          <img src="images/insertion/step1.png" 
               class="zoom-img" 
               alt="If the first element is greater than key, then key is placed in front of the first element.">
        </div>
      </div>

      <h3>Step 2</h3>
      <div class="section-block">
        <div class="image-row">
          <img src="images/insertion/step2.png" 
               class="zoom-img" 
               alt="Place 1 at the beginning">
        </div>
      </div>

      <h3>Step 3</h3>
      <div class="section-block">
        <div class="image-row">
          <img src="images/insertion/step3.png" 
               class="zoom-img" 
               alt="Place 4 behind 1">
        </div>
      </div>

      <h3>Step 4</h3>
      <div class="section-block">
        <div class="image-row">
          <img src="images/insertion/step4.png" 
               class="zoom-img" 
               alt="Place 3 behind 1 and the array is sorted">
        </div>
      </div>

      <h3>Time Complexity</h3>
      <ul>
        <li><b>Best-case:</b> O(n)</li>
        <li><b>Average-case:</b> O(n²)</li>
        <li><b>Worst-case:</b> O(n²)</li>
      </ul>
      <div class="section-block">
      <h3>Try it yourself: Insertion Sort complexity</h3>

      <div class="complexity-panel" data-algo="selectionSort">
        <div class="complexity-controls">
          <label>Array size:</label>
          <input type="range" class="complexity-slider" min="10" max="500" value="50">
          <span class="complexity-slider-value">50</span>

          <button class="complexity-run">Run</button>
          <button class="complexity-clear">Clear</button>
        </div>

        <p>Operations: <span class="complexity-ops">0</span></p>

        <canvas class="complexity-canvas"></canvas>
      </div>
    </div>
    `
  },


  quickSort: {
    title: "Quick Sort",
    complexityCurves: ["Olog", "O2"],
    html: `
      <p>
        As the name suggests, Quicksort is one of the fastest sorting algorithms.
        It chooses one element as the pivot and arranges the remaining elements
        so that all smaller values go to the left and larger values go to the right.
      </p>

      <h3>How it works</h3>
      <ul>
        <li>Choose a value in the array to be the pivot element.</li>
        <li>Put all the lower values to the left and higher values to the right.</li>
        <li>Swap the pivot element so that it lands in its correct sorted location.</li>
        <li>Repeat the same process recursively on left and right sub-arrays.</li>
      </ul>

      <div class="section-block">
        <h3>Choose Pivot</h3>
        <div class="image-row">
          <img src="images/quick/step1.png" class="zoom-img" alt="Select a pivot element.">
        </div>
      </div>

      <div class="section-block">
        <h3>Partition Process</h3>
        <div class="image-row">
          <img src="images/quick/step2.png" class="zoom-img" alt="Put all the smaller elements on the left and greater on the right of pivot element.">
        </div>

        <div class="image-row">
          <img src="images/quick/step3.png" class="zoom-img" alt="Comparison of pivot element with element beginning from the first index.">
        </div>

        <div class="image-row">
          <img src="images/quick/step4.png" class="zoom-img" alt="If the element is greater than the pivot element, a second pointer is set for that element.">
        </div>

        <div class="image-row">
          <img src="images/quick/step5.png" class="zoom-img" alt="Pivot is compared with other elements.">
        </div>

        <div class="image-row">
          <img src="images/quick/step6.png" class="zoom-img" alt="The process is repeated to set the next greater element as the second pointer.">
        </div>
        <div class="image-row">
          <img src="images/quick/step7.png" class="zoom-img" alt="The process goes on until the second last element is reached">
        </div>
        <div class="image-row">
          <img src="images/quick/step8.png" class="zoom-img" alt="Finally, the pivot element is swapped with the second pointer">
        </div>
      </div>

      <div class="section-block">
        <h3>Recursive Partitioning</h3>
        <div class="image-row">
          <img src="images/quick/recursion.png" class="zoom-img" alt="Recursive placement of pivot elements">
        </div>
      </div>

      <div class="section-block">
        <h3>Time Complexity</h3>
        <ul>
          <li><b>Best-case:</b> O(n log n)</li>
          <li><b>Average-case:</b> O(n log n)</li>
          <li><b>Worst-case:</b> O(n²)</li>
        </ul>
      </div>
      <div class="section-block">
      <h3>Try it yourself: Quick Sort complexity</h3>

      <div class="complexity-panel" data-algo="quickSort">
        <div class="complexity-controls">
          <label>Array size:</label>
          <input type="range" class="complexity-slider" min="10" max="500" value="50">
          <span class="complexity-slider-value">50</span>

          <button class="complexity-run">Run</button>
          <button class="complexity-clear">Clear</button>
        </div>

        <p>Operations: <span class="complexity-ops">0</span></p>

        <canvas class="complexity-canvas"></canvas>
      </div>
    </div>
    `
  },

  mergeSort: {
    title: "Merge Sort",
    complexityCurves: ["Olog"],
    html: `
    <p>
      The Merge Sort algorithm is a divide-and-conquer algorithm that sorts an array by first breaking it down into smaller arrays, and then building the array back together the correct way so that it is sorted.
    </p>

    <p>
      <b>Divide:</b> The algorithm starts with breaking up the array into smaller and smaller pieces until one such sub-array only consists of one element.
    </p>

    <p>
      <b>Conquer:</b> The algorithm merges the small pieces of the array back together by putting the lowest values first, resulting in a sorted array.
    </p>

    <p>
      The breaking down and building up of the array to sort the array is done recursively.
    </p>

    <h3>How it works</h3>
    <ol>
      <li>Divide the unsorted array into two sub-arrays, half the size of the original.</li>
      <li>Continue to divide the sub-arrays as long as the current piece of the array has more than one element.</li>
      <li>Merge two sub-arrays together by always putting the lowest value first.</li>
      <li>Keep merging until there are no sub-arrays left.</li>
    </ol>

    <div class="section-block">
      <h3>Merge Sort example</h3>
      <div class="image-row">
        <img
          src="images/merge/example.png"
          class="zoom-img"
          alt="Merge Sort example"
          data-caption="Merge Sort example"
        >
      </div>
    </div>

    <div class="section-block">
      <h3>Time Complexity</h3>
      <ul>
        <li><b>Best-case:</b> O(n log n)</li>
        <li><b>Average-case:</b> O(n log n)</li>
        <li><b>Worst-case:</b> O(n log n)</li>
      </ul>

      <img
        src="images/merge/complexity.png"
        class="full-img"
        alt="Merge Sort time complexity"
        data-caption="Merge Sort Time Complexity: O(n log n)"
      >
    </div>
  `
  }

};


/* ================= LOAD LESSON ON SLICE CLICK ================= */
const lessonBox = document.getElementById("lessonContent");

document.querySelectorAll(".slice").forEach((slice) => {
  slice.addEventListener("click", () => {
    const key = slice.dataset.key;
    const lesson = lessons[key];

    if (!lesson || !lessonBox) return;

    lessonBox.innerHTML = `
      <h2>${lesson.title}</h2>
      ${lesson.html}
    `;


    initComplexityPanel(key);
  });
});


/* ================= COMPLEXITY CHART LOGIC ================= */

// Keep a reference so we can destroy the old chart when switching lessons
let activeComplexityChart = null;

// Simple Bubble Sort op counter
function countOpsBubbleSort(arr) {
  let ops = 0;
  let n = arr.length;
  let swapped = true;

  while (swapped) {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      ops++; // comparison
      if (arr[i] > arr[i + 1]) {
        ops++; // swap
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    n--;
  }
  return ops;
}

function countOpsSelectionSort(arr) {
  let ops = 0;
  let n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      ops++; // comparison
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      ops++; // swap
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return ops;
}

// ===============================
// INSERTION SORT OPS
// ===============================
function countOpsInsertionSort(arr) {
  let ops = 0;

  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0) {
      ops++; // comparison
      if (arr[j] > key) {
        ops++; // shift
        arr[j + 1] = arr[j];
        j--;
      } else {
        break;
      }
    }
    arr[j + 1] = key;
  }
  return ops;
}

// ===============================
// QUICK SORT OPS
// ===============================
function countOpsQuickSort(arr) {
  let ops = 0;

  function partition(left, right) {
    let pivot = arr[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
      ops++; // comparison
      if (arr[j] < pivot) {
        i++;
        ops++; // swap
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    ops++; // swap pivot
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    return i + 1;
  }

  function quick(left, right) {
    if (left < right) {
      let pi = partition(left, right);
      quick(left, pi - 1);
      quick(pi + 1, right);
    }
  }

  quick(0, arr.length - 1);
  return ops;
}

// ===============================
// MERGE SORT OPS
// ===============================
function countOpsMergeSort(arr) {
  let ops = 0;

  function merge(left, right) {
    let result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
      ops++; // comparison
      if (left[i] < right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  }

  function mergeSort(a) {
    if (a.length <= 1) return a;

    let mid = Math.floor(a.length / 2);
    let left = mergeSort(a.slice(0, mid));
    let right = mergeSort(a.slice(mid));

    return merge(left, right);
  }

  mergeSort(arr);
  return ops;
}

// Map of algorithm keys → counting functions
const complexityRunners = {
  bubbleSort: countOpsBubbleSort,
  // You can add more later:
  selectionSort: countOpsSelectionSort,
  insertionSort: countOpsInsertionSort,
  quickSort: countOpsQuickSort,
  mergeSort: countOpsMergeSort,
};

// Initialize complexity chart for the current lesson (if panel exists)
function initComplexityPanel(algoKey) {
  if (!lessonBox) return;

  const panel = lessonBox.querySelector(".complexity-panel");
  if (!panel) return;

  const slider = panel.querySelector(".complexity-slider");
  const sliderValue = panel.querySelector(".complexity-slider-value");
  const runBtn = panel.querySelector(".complexity-run");
  const clearBtn = panel.querySelector(".complexity-clear");
  const opsSpan = panel.querySelector(".complexity-ops");
  const canvas = panel.querySelector(".complexity-canvas");
  const lesson = lessons[algoKey];

  if (!slider || !sliderValue || !runBtn || !clearBtn || !opsSpan || !canvas) {
    return;
  }

  // update slider text
  slider.addEventListener("input", () => {
    sliderValue.textContent = slider.value;
  });
  sliderValue.textContent = slider.value;

  const ctx = canvas.getContext("2d");

  // destroy old chart
  if (activeComplexityChart) {
    activeComplexityChart.destroy();
    activeComplexityChart = null;
  }

  // dynamic datasets
  const datasets = [
    {
      label: "Test Points",
      data: [],
      parsing: false,
      showLine: false,
      pointRadius: 5,
      backgroundColor: "blue",
      borderColor: "blue",
    }
  ];

  if (lesson.complexityCurves?.includes("O2")) {
    datasets.push({
      label: "O(n²)",
      data: [],
      parsing: false,
      borderColor: "red",
      fill: false,
      pointRadius: 0,
      pointHoverRadius: 0
    });
  }

  if (lesson.complexityCurves?.includes("Olog")) {
    datasets.push({
      label: "O(n log n)",
      data: [],
      parsing: false,
      borderColor: "green",
      fill: false,
      pointRadius: 0,
      pointHoverRadius: 0
    });
  }

  // create chart AFTER ctx exists
  activeComplexityChart = new Chart(ctx, {
    type: "line",
    data: { datasets },
    options: {
      scales: {
        x: { type: "linear", min: 0, max: 500 },
        y: {}
      }
    }
  });

  // add reference curves
  for (let n = 10; n <= 500; n += 10) {
    const o2 = activeComplexityChart.data.datasets.find(d => d.label === "O(n²)");
    if (o2) o2.data.push({ x: n, y: n * n });

    const olog = activeComplexityChart.data.datasets.find(d => d.label === "O(n log n)");
    if (olog) olog.data.push({ x: n, y: n * Math.log2(n) * 20 });
  }

  activeComplexityChart.update();

  // run
  runBtn.addEventListener("click", () => {
    const n = Number(slider.value);
    const runAlgo = complexityRunners[algoKey];
    if (!runAlgo) return;

    const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 100));
    const ops = runAlgo([...arr]);

    opsSpan.textContent = ops;

    activeComplexityChart.data.datasets[0].data.push({ x: n, y: ops });
    activeComplexityChart.update();
  });

  // clear
  clearBtn.addEventListener("click", () => {
    opsSpan.textContent = "0";
    activeComplexityChart.data.datasets[0].data = [];
    activeComplexityChart.update();
  });
}


