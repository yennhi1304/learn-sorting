// ==========================================
// UI Elements
// ==========================================
const slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");
const runBtn = document.getElementById("runBtn");
const clearBtn = document.getElementById("clearBtn");
const opsCount = document.getElementById("opsCount");
const arrayContainer = document.getElementById("arrayContainer");

// Track operations
let operations = 0;

// Update displayed slider value
slider.oninput = () => {
    sliderValue.textContent = slider.value;
    generateArray();
};

// =====================================================
// Generate array
// =====================================================
function generateArray() {
    const n = Number(slider.value);
    const type = document.querySelector('input[name="gen"]:checked').value;

    let arr = [];

    if (type === "random") {
        for (let i = 0; i < n; i++) arr.push(Math.floor(Math.random() * 100));
    } else if (type === "asc") {
        for (let i = 0; i < n; i++) arr.push(i);
    } else if (type === "desc") {
        for (let i = n; i > 0; i--) arr.push(i);
    }

    renderArray(arr);
    return arr;
}

// =====================================================
// Render bars in preview
// =====================================================
function renderArray(arr) {
    arrayContainer.innerHTML = "";
    arr.forEach(v => {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = v + "px";
        arrayContainer.appendChild(bar);
    });
}

// =====================================================
// Bubble Sort with operation counting
// =====================================================
function bubbleSort(arr) {
    operations = 0;

    let n = arr.length;
    let swapped = true;

    while (swapped) {
        swapped = false;

        for (let i = 0; i < n - 1; i++) {
            operations++; // comparison

            if (arr[i] > arr[i + 1]) {
                operations++; // swap
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
            }
        }
        n--;
    }

    opsCount.textContent = operations;
    return operations;
}

// =====================================================
// Chart.js Setup
// =====================================================
const ctx = document.getElementById("chartCanvas").getContext("2d");

const chart = new Chart(ctx, {
    type: "line",
    data: {
        datasets: [
            {
                label: "Test Points",
                data: [],
                borderColor: "blue",
                backgroundColor: "blue",
                showLine: false,
                pointRadius: 5,
            },
            {
                label: "O(n²)",
                data: [],
                borderColor: "red",
                borderDash: [5, 5],
                fill: false,
            },
            {
                label: "O(n log n)",
                data: [],
                borderColor: "green",
                borderDash: [5, 5],
                fill: false,
            }
        ]
    },
    options: {
        scales: {
            x: { title: { display: true, text: "n" } },
            y: { title: { display: true, text: "Operations" } }
        }
    }
});

// Precompute reference curves
for (let n = 10; n <= 500; n += 10) {
    chart.data.datasets[1].data.push({ x: n, y: n * n * 1.0 });       // O(n²)
    chart.data.datasets[2].data.push({ x: n, y: n * Math.log2(n) * 30 }); // O(n log n)
}
chart.update();

// =====================================================
// Run button — perform test
// =====================================================
runBtn.onclick = () => {
    let arr = generateArray();
    let n = arr.length;

    let ops = bubbleSort(arr);

    chart.data.datasets[0].data.push({ x: n, y: ops });
    chart.update();
};

// =====================================================
// Clear graph
// =====================================================
clearBtn.onclick = () => {
    chart.data.datasets[0].data = [];
    chart.update();
    opsCount.textContent = 0;
};
