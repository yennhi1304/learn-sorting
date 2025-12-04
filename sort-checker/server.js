const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// =========================
// Pattern detectors
// =========================

// Bubble Sort detection
// =========================
// Helpers
// =========================
function normalize(code) {
  return code
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/[ \t]+/g, " ")   // chỉ gom space, KHÔNG xóa newline
    .trim();
}


// Bubble Sort detection
function detectBubble(code) {
  // 2 vòng for lồng nhau
  const twoLoops =
    /for\s*\([^)]*\)[\s\S]{0,120}for\s*\([^)]*\)/.test(code);

  // so sánh phần tử kề nhau: a[j] ? a[j+1]
  const adjacentCompare =
    /\w+\s*\[\s*j\s*\]\s*[<>]=?\s*\w+\s*\[\s*j\s*\+\s*1\s*\]/;

  // hoặc swap / gán thủ công a[j+1] = a[j]
  const manualSwap =
    /\w+\s*\[\s*j\s*\+\s*1\s*\]\s*=\s*\w+\s*\[\s*j\s*\]/;

  return twoLoops && (adjacentCompare.test(code) || manualSwap.test(code));
}


function detectInsertion(code) {
  // key = arr[i]
  const keyAssign =
    /\bkey\b\s*=\s*\w+\s*\[\s*i\s*\]/;

  // while (j >= 0 && arr[j] > key)
  const whileCond =
    /while\s*\([^)]*j\s*>=\s*0[^)]*\w+\s*\[\s*j\s*\]\s*>\s*key[^)]*\)/;

  // shift arr[j+1] = arr[j]
  const shift =
    /\w+\s*\[\s*j\s*\+\s*1\s*\]\s*=\s*\w+\s*\[\s*j\s*\]/;

  // insert arr[j+1] = key
  const insertKey =
    /\w+\s*\[\s*j\s*\+\s*1\s*\]\s*=\s*key/;

  return keyAssign.test(code) && whileCond.test(code) && shift.test(code) && insertKey.test(code);
}


function detectSelection(code) {
  // 2 vòng for lồng nhau
  const twoLoops =
    /for\s*\([^)]*\)[\s\S]{0,200}for\s*\([^)]*\)/.test(code);

  // min index declaration: có thể là min, min_idx, minimum, indexMin...
  const minInit =
    /(int|auto)\s+(min|min_idx|minIndex|min_index|minimum)\w*\s*=\s*\w+/;

  // if (arr[i] < arr[min_idx])
  const compareMin =
    /if\s*\([^)]*\w+\s*\[\s*\w+\s*\]\s*<\s*\w+\s*\[\s*(min|min_idx|minIndex|min_index|minimum)\w*\s*\]/;

  // swap(&array[min_idx], &array[step]) hoặc swap(arr[min_idx], arr[i])
  const swapMin =
    /swap\s*\([^)]*(min|min_idx|minIndex|min_index|minimum)[^)]*\)/;

  return twoLoops && minInit.test(code) && compareMin.test(code) && swapMin.test(code);
}


function detectMerge(code) {
  const hasMergeSortName =
    /(mergeSort|merge_sort)\s*\(/;

  const hasMergeFn =
    /merge\s*\(\s*\w+/;

  // mid = (l + r) / 2 OR l + (r-l)/2 OR (l+r)>>1
  const hasMid =
    /\bmid\b\s*=\s*[^;]+/;

  // recursive call mergeSort(...)
  const recursive =
    /(mergeSort|merge_sort)\s*\([^)]*(mid|m)[^)]*\)/;

  return hasMergeSortName.test(code) &&
         (hasMergeFn.test(code) || recursive.test(code) || hasMid.test(code));
}



// QuickSort detection
function detectQuick(code) {
    code = code.replace(/\s+/g, " ");

    const hasPartition =
        /partition\s*\(\s*\w+/.test(code);

    const recursive =
        /quick\s*sort\s*\(\s*\w+/.test(code);

    const pivotDecl =
        /(int|auto|float|double)\s+pivot/.test(code);

    return hasPartition || recursive || pivotDecl;
}


// =========================
// Classifier
// =========================
// =========================
// Classifier
// =========================
function classify(rawCode) {
  const code = normalize(rawCode);

  if (detectInsertion(code)) return { ok: true, algorithm: "Insertion Sort" };
  if (detectBubble(code))    return { ok: true, algorithm: "Bubble Sort" };
  if (detectSelection(code)) return { ok: true, algorithm: "Selection Sort" };
  if (detectMerge(code))     return { ok: true, algorithm: "Merge Sort" };
  if (detectQuick(code))     return { ok: true, algorithm: "Quick Sort" };

  return { ok: false, algorithm: "Unknown" };
}



// =========================
// API
// =========================
app.post("/api/run", (req, res) => {
    const code = req.body.code || "";
    res.json(classify(code));
});

// =========================
// Start server
// =========================
app.listen(3000, () => {
    console.log("✔ Sort Detector running at http://localhost:3000");
});
