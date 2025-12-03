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

        <img src="images/selection/complexity.png" class="full-img" alt="Selection sort complexity graph">
      </div>
    `
  },

  bubbleSort: {
  title: "Bubble Sort",
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
      <img src="images/bubble/b_complexity.png" class="full-img" alt="Bubble Sort Complexity Graph">
    </div>
  `
},

insertionSort: {
    title: "Insertion Sort",
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
      <img src="images/insertion/complexity.png" class="full-img" alt="Insertion Sort Complexity Graph">
    `
},


  quickSort: {
    title: "Quick Sort",
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

        <img src="images/quick/complexity.png" class="full-img" alt="Quick sort time complexity graph">
      </div>
    `
},

  mergeSort: {
  title: "Merge Sort",
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
  });
});
