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
    <h3>Example</h3>
      <div class="section-block">
      <div class="gfg-slider"></div>

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
      <h3>Complexity Plot</h3>

      <div class="complexity-panel" data-algo="selectionSort">
        <div class="complexity-controls">
          <label>Array size:</label>
          <input type="range" class="complexity-slider" min="0" max="50" value="25">
          <span class="complexity-slider-value">50</span>

          <button class="complexity-run">Run</button>
          <button class="complexity-clear">Clear</button>
          <button class="complexity-run10">Run ×10</button>
        </div>

        <div class="input-modes">
  <label><input type="radio" name="inputMode" value="asc" checked> Ascending</label>
  <label><input type="radio" name="inputMode" value="rand"> Random</label>
  <label><input type="radio" name="inputMode" value="desc"> Descending</label>
</div>

        <p class ="operation_count">Operations: <span class="complexity-ops">0</span></p>

        <canvas class="complexity-canvas"></canvas>
      </div>
    </div>
    `
  },

  bubbleSort: {
    title: "Bubble Sort",
    complexityCurves: ["O2", "On"],
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
    <h3>Example</h3>
    <div class="section-block">
      <div class="gfg-slider"></div>

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
      <h3>Complexity Plot</h3>

      <div class="complexity-panel" data-algo="bubbleSort">
        <div class="complexity-controls">
          <label>Array size:</label>
          <input type="range" class="complexity-slider" min="0" max="50" value="25">
          <span class="complexity-slider-value">50</span>

          <button class="complexity-run">Run</button>
          <button class="complexity-clear">Clear</button>
          <button class="complexity-run10">Run ×10</button>
        </div>
        <div class="input-modes">
  <label><input type="radio" name="inputMode" value="asc" checked> Ascending</label>
  <label><input type="radio" name="inputMode" value="rand"> Random</label>
  <label><input type="radio" name="inputMode" value="desc"> Descending</label>
</div>

        <p class="operation_count">Operations: <span class="complexity-ops">0</span></p>

        <canvas class="complexity-canvas"></canvas>
      </div>
    </div>
  `
  },


  insertionSort: {
    title: "Insertion Sort",
    complexityCurves: ["O2", "On"],
    html: `
      <p>
        The Insertion Sort algorithm uses one part of the array to hold the sorted values, 
        and the other part of the array to hold the values that are not sorted yet.
      </p>
      <h3>How it works</h3>
      <ul>
        <li>Take the first value from the unsorted part of the array.</li>
        <li>Move the value into the correct place in the sorted part of the array.</li>
        <li>Go through the unsorted part of the array again as many times as there are values.</li>
      </ul>
      <h3>Example</h3>
      <div class="section-block">
      <div class="gfg-slider"></div>
    </div>

      <h3>Time Complexity</h3>
      <ul>
        <li><b>Best-case:</b> O(n)</li>
        <li><b>Average-case:</b> O(n²)</li>
        <li><b>Worst-case:</b> O(n²)</li>
      </ul>
      <div class="section-block">
      <h3>Complexity Plot</h3>

      <div class="complexity-panel" data-algo="insertionSort">
        <div class="complexity-controls">
          <label>Array size:</label>
          <input type="range" class="complexity-slider" min="0" max="50" value="25">
          <span class="complexity-slider-value">50</span>

          <button class="complexity-run">Run</button>
          <button class="complexity-clear">Clear</button>
          <button class="complexity-run10">Run ×10</button>
        </div>
        <div class="input-modes">
  <label><input type="radio" name="inputMode" value="asc" checked> Ascending</label>
  <label><input type="radio" name="inputMode" value="rand"> Random</label>
  <label><input type="radio" name="inputMode" value="desc"> Descending</label>
</div>

        <p class = "operation_count">Operations: <span class="complexity-ops">0</span></p>

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
    <h3>Example</h3>
      <div class="section-block">
      <div class="gfg-slider"></div>
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
      <h3>Complexity Plot</h3>

      <div class="complexity-panel" data-algo="quickSort">
        <div class="complexity-controls">
          <label>Array size:</label>
          <input type="range" class="complexity-slider" min="0" max="50" value="25">
          <span class="complexity-slider-value">50</span>

          <button class="complexity-run">Run</button>
          <button class="complexity-clear">Clear</button>
          <button class="complexity-run10">Run ×10</button>
        </div>
        <div class="input-modes">
  <label><input type="radio" name="inputMode" value="asc" checked> Ascending</label>
  <label><input type="radio" name="inputMode" value="rand"> Random</label>
  <label><input type="radio" name="inputMode" value="desc"> Descending</label>
</div>

        <p class="operation_count">Operations: <span class="complexity-ops">0</span></p>

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
    <h3>Example</h3>
    <div class="section-block">
      <div class="gfg-slider"></div>

    </div>

    <div class="section-block">
      <h3>Time Complexity</h3>
      <ul>
        <li><b>Best-case:</b> O(n log n)</li>
        <li><b>Average-case:</b> O(n log n)</li>
        <li><b>Worst-case:</b> O(n log n)</li>
      </ul>

      <div class="section-block">
      <h3>Complexity Plot</h3>

      <div class="complexity-panel" data-algo="mergeSort">
        <div class="complexity-controls">
          <label>Array size:</label>
          <input type="range" class="complexity-slider" min="0" max="50" value="25">
          <span class="complexity-slider-value">50</span>

          <button class="complexity-run">Run</button>
          <button class="complexity-clear">Clear</button>
          <button class="complexity-run10">Run ×10</button>
        </div>
        <div class="input-modes">
  <label><input type="radio" name="inputMode" value="asc" checked> Ascending</label>
  <label><input type="radio" name="inputMode" value="rand"> Random</label>
  <label><input type="radio" name="inputMode" value="desc"> Descending</label>
</div>

        <p class = "operation_count">Operations: <span class="complexity-ops">0</span></p>

        <canvas class="complexity-canvas"></canvas>
      </div>
    </div>
    </div>
  `
  }

};

/* ================= IMAGE SLIDER (GFG STYLE) ================= */

const sliderImages = {
  selectionSort: 6,
  bubbleSort: 3,
  insertionSort: 5,
  mergeSort: 4,
  quickSort: 6,
};

// map key → correct folder name
const folderMap = {
  selectionSort: "selection",
  bubbleSort: "bubble",
  insertionSort: "insertion",
  mergeSort: "merge",
  quickSort: "quick",
};

function mountSlider(algoKey) {
  const container = document.querySelector(".gfg-slider");
  if (!container) return;

  const total = sliderImages[algoKey];
  if (!total) return;

  const folder = folderMap[algoKey];
  let index = 1;
  let autoPlay = null; // timer

  container.innerHTML = `
    <div class="gfg-slider-main">
      <img class="gfg-slider-img" src="images/${folder}/${index}.webp">
    </div>



  <div class="gfg-slider-controls">
      <button class="gfg-prev">❮</button>
      <button class="gfg-play">⏵</button>
      <button class="gfg-next">❯</button>

      <span class="gfg-page-number">${index}/${total}</span>
  </div>


  `;

  const img = container.querySelector(".gfg-slider-img");
  const prev = container.querySelector(".gfg-prev");
  const next = container.querySelector(".gfg-next");
  const playBtn = container.querySelector(".gfg-play");
  const pageNum = container.querySelector(".gfg-page-number");

  function updateImage() {
    img.classList.add("fade-out");

    setTimeout(() => {
      img.src = `images/${folder}/${index}.webp`;
      img.classList.remove("fade-out");
      img.classList.add("fade-in");

      setTimeout(() => img.classList.remove("fade-in"), 400);
    }, 300);

    pageNum.textContent = `${index}/${total}`;
  }

  prev.onclick = () => {
    index--;
    if (index < 1) index = total;
    updateImage();
  };

  next.onclick = () => {
    index++;
    if (index > total) index = 1;
    updateImage();
  };

  function startAutoPlay() {
    playBtn.textContent = "⏸";
    autoPlay = setInterval(() => {
      index++;
      if (index > total) index = 1;
      updateImage();
    }, 5000);
  }

  function stopAutoPlay() {
    playBtn.textContent = "⏵";
    clearInterval(autoPlay);
    autoPlay = null;
  }

  playBtn.onclick = () => {
    if (autoPlay) stopAutoPlay();
    else startAutoPlay();
  };
}

/* ================= LOAD LESSON ON SLICE CLICK ================= */
const lessonBox = document.getElementById("lessonContent");

document.querySelectorAll(".slice").forEach((slice) => {
  slice.addEventListener("click", () => {

    // Remove selected class from all slices
    document.querySelectorAll(".slice").forEach(s => s.classList.remove("selected"));

    // Mark this slice as selected
    slice.classList.add("selected");

    // (existing code)
    const key = slice.dataset.key;
    const lesson = lessons[key];
    if (!lesson || !lessonBox) return;

    lessonBox.innerHTML = `
      <h2>${lesson.title}</h2>
      ${lesson.html}
    `;
    mountSlider(key);
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

  function quick(a, low, high) {
    if (low >= high) return;

    const p = partition(a, low, high);
    quick(a, low, p - 1);
    quick(a, p + 1, high);
  }

  function partition(a, low, high) {
    let pivot = a[high];
    let i = low;

    for (let j = low; j < high; j++) {
      ops++; // comparison with pivot
      if (a[j] <= pivot) {
        ops++; // swap animation
        [a[i], a[j]] = [a[j], a[i]];
        i++;
      }
    }

    ops++; // final pivot swap
    [a[i], a[high]] = [a[high], a[i]];
    return i;
  }

  quick(arr, 0, arr.length - 1);
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

    // count comparisons in merge
    while (i < left.length && j < right.length) {
      ops++; // comparison
      if (left[i] < right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }

    ops++; // finishing concat
    return result.concat(left.slice(i)).concat(right.slice(j));
  }

  function mergeSort(a) {
    if (a.length <= 1) return a;

    ops++; // count the split
    let mid = Math.floor(a.length / 2);

    // recursion overhead (this boosts n log n shape)
    ops++;
    let left = mergeSort(a.slice(0, mid));

    ops++;
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

function buildArrayByMode(n, mode) {
  // Use 1..n to avoid duplicates
  let arr = Array.from({ length: n }, (_, i) => i + 1);

  if (mode === "rand") {
    // Shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  if (mode === "asc") return arr;   // already sorted
  if (mode === "desc") return arr.reverse();

  return arr;
}



// Initialize complexity chart for the current lesson (if panel exists)
function initComplexityPanel(algoKey) {
  if (!lessonBox) return;

  const panel = lessonBox.querySelector(".complexity-panel");
  if (!panel) return;

  const slider = panel.querySelector(".complexity-slider");
  const sliderValue = panel.querySelector(".complexity-slider-value");
  const runBtn = panel.querySelector(".complexity-run");
  const clearBtn = panel.querySelector(".complexity-clear");
  const opsCount = panel.querySelector(".operation_count");
  const canvas = panel.querySelector(".complexity-canvas");
  const lesson = lessons[algoKey];

  if (!slider || !sliderValue || !runBtn || !clearBtn || !canvas) {
    return;
  }

  // update slider text
  slider.addEventListener("input", () => {
    sliderValue.textContent = slider.value;
  });
  sliderValue.textContent = slider.value;

  const ctx = canvas.getContext("2d");

  // destroy previous chart
  if (activeComplexityChart) {
    activeComplexityChart.destroy();
    activeComplexityChart = null;
  }

  // base dataset
  const datasets = [
    {
      label: "Test Points",
      data: [],
      parsing: false,
      showLine: false,
      pointRadius: 3,
      pointHoverRadius: 4,
      backgroundColor: "blue",
      borderColor: "blue",
    }
  ];

  // =======================================================
  // ADD THEORETICAL CURVES + COLLECT MAX VALUES
  // =======================================================

  if (lesson.complexityCurves?.includes("O2")) {
    const o2 = {
      label: "O(n²)",
      data: [],
      parsing: false,
      borderColor: "red",
      borderDash: [6, 6],
      pointRadius: 0
    };
    for (let n = 1; n <= 50; n++) {
      o2.data.push({ x: n, y: n * n });
    }
    datasets.push(o2);
  }

  if (lesson.complexityCurves?.includes("Olog")) {
    const olog = {
      label: "O(n log n)",
      data: [],
      parsing: false,
      borderColor: "green",
      borderDash: [6, 6],
      pointRadius: 0
    };
    for (let n = 1; n <= 50; n++) {
      olog.data.push({ x: n, y: n * Math.log2(n) });
    }
    datasets.push(olog);
  }

  if (lesson.complexityCurves?.includes("On")) {
    const on = {
      label: "O(n)",
      data: [],
      parsing: false,
      borderColor: "orange",
      borderDash: [6, 6],
      pointRadius: 0
    };
    for (let n = 1; n <= 50; n++) {
      on.data.push({ x: n, y: n });
    }
    datasets.push(on);
  }


  let yMax = 0;

  if (lesson.complexityCurves?.includes("O2")) {
    yMax = Math.max(yMax, 2500);       // max n² for n=50
  }
  if (lesson.complexityCurves?.includes("Olog")) {
    yMax = Math.max(yMax, 300);        // max n log n for n=50
  }
  if (lesson.complexityCurves?.includes("On")) {
    yMax = Math.max(yMax, 50);         // max n for n=50
  }

  // Add padding so curves aren't flush against top
  yMax = Math.ceil(yMax * 1.2);

  // Round Y max to a “nice” number
  yMax = Math.ceil(yMax / 100) * 100;

  // Pick a good tick size
  let tickSize = Math.ceil(yMax / 6 / 100) * 100;


  const run10Btn = panel.querySelector(".complexity-run10");

  if (run10Btn) {
    run10Btn.addEventListener("click", () => {
      runRandomTests(10);
    });
  }





  activeComplexityChart = new Chart(ctx, {
    type: "line",
    data: { datasets },
    options: {
      scales: {

        // ================= X AXIS =================
        x: {
          type: "linear",
          beginAtZero: true,
          min: 0,
          max: 50,
          ticks: {
            stepSize: 5
          },
          title: {
            display: true,
            text: "Input Size (n)",
            font: { size: 14, weight: "bold" }
          }
        },

        // ================= Y AXIS =================
        y: {
          beginAtZero: true,
          min: 0,
          max: yMax,          // ← automatically chosen!
          ticks: {
            stepSize: tickSize
          },
          title: {
            display: true,
            text: "Operation Count",
            font: { size: 14, weight: "bold" }
          }
        }
      }
    }
  });

 async function runRandomTests() {
  const runAlgo = complexityRunners[algoKey];
  if (!runAlgo) return;

  const mode = panel.querySelector("input[name='inputMode']:checked")?.value || "rand";

  let opsList = [];

  for (let i = 0; i < 10; i++) {

    const size = Math.floor(Math.random() * 46) + 5;
    const arr = buildArrayByMode(size, mode);
    const ops = runAlgo([...arr]);

    opsList.push(ops);

    activeComplexityChart.data.datasets[0].data.push({
      x: size,
      y: ops
    });

    activeComplexityChart.update();

    await new Promise(r => setTimeout(r, 15));
  }

  // Compute average
  const avg = Math.round(
    opsList.reduce((sum, v) => sum + v, 0) / opsList.length
  );

  // Update text label
  opsCount.textContent = `Average operations: ${avg}`;
}





  // ===============================
  // RUN BUTTON
  // ===============================
  runBtn.addEventListener("click", () => {
    const n = Number(slider.value);
    const runAlgo = complexityRunners[algoKey];
    if (!runAlgo) return;

    const mode = panel.querySelector("input[name='inputMode']:checked")?.value || "rand";

    const arr = buildArrayByMode(n, mode);

    const ops = runAlgo([...arr]); 

    // FIXED (restore correct label)
    opsCount.textContent = `Operations: ${ops}`;

    // Record result in chart
    activeComplexityChart.data.datasets[0].data.push({
        x: n,
        y: ops
    });

    activeComplexityChart.update();
});



  // ===============================
  // CLEAR BUTTON
  // ===============================
  clearBtn.addEventListener("click", () => {
    opsCount.textContent = "Average: 0";
    activeComplexityChart.data.datasets[0].data = [];
    activeComplexityChart.update();
  });
}



