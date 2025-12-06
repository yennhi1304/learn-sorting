// sorting checker elements: buttons and textfields
const jsBtn    = document.getElementById("jsBtn");
const cppBtn   = document.getElementById("cppBtn");
const codeArea = document.getElementById("code");
const checkBtn = document.getElementById("checkBtn");
const result   = document.getElementById("result");

let mode = "js";

// --------------------------------------------
// MODE SWITCHING
// --------------------------------------------
function setMode(newMode) {
  mode = newMode;

  jsBtn.classList.toggle("active", mode === "js");
  cppBtn.classList.toggle("active", mode === "cpp");

  if (mode === "js") {
    codeArea.value =
`function mySort(arr) {
  // JavaScript sorting code (ascending)
  return arr;
}`;
  } else {
    codeArea.value =
`vector<int> mySort(vector<int> arr) {
  // C++-style sorting code (ascending)
  return arr;
}`;
  }

  result.textContent = "";
}

setMode("js");
jsBtn.addEventListener("click", () => setMode("js"));
cppBtn.addEventListener("click", () => setMode("cpp"));


// --------------------------------------------
// SHOW ARRAY DIFFERENCE
// --------------------------------------------
function showDiff(userArr, correctArr) {
  let lines = [];
  for (let i = 0; i < correctArr.length; i++) {
    if (userArr[i] !== correctArr[i]) {
      lines.push(
        `Index ${i}: expected ${correctArr[i]}, got ${userArr[i]}`
      );
    }
  }
  return lines.join("\n");
}


// --------------------------------------------
// SAFE JS PARSER
// --------------------------------------------
function parseJsFunction(codeText) {
  try {
    // Try standard function form
    const f1 = eval("(" + codeText + ")");
    if (typeof f1 === "function") return f1;
  } catch {}

  try {
    // Try named function form
    eval(codeText);
    if (typeof mySort === "function") return mySort;
  } catch {}

  throw new Error("Cannot parse JavaScript function. Make sure it's valid JS.");
}


// --------------------------------------------
// IMPROVED C++ BODY EXTRACTION USING BRACE COUNTER
// --------------------------------------------
function extractCppBody(text) {
  const start = text.indexOf("mySort");
  if (start < 0) throw new Error("Function mySort not found.");

  const firstBrace = text.indexOf("{", start);
  if (firstBrace < 0) throw new Error("Opening brace not found.");

  let depth = 1;
  let i = firstBrace + 1;

  while (i < text.length && depth > 0) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") depth--;
    i++;
  }

  if (depth !== 0) throw new Error("Braces not balanced in function.");

  return text.slice(firstBrace + 1, i - 1);
}


// --------------------------------------------
// IMPROVED SIMULATED C++ → JS CONVERTER
// --------------------------------------------
function simulateCppSort(codeText, inputArray) {
  const body = extractCppBody(codeText);

  let jsBody = body
    .replace(/vector<int>/g, "")
    .replace(/int\s+([A-Za-z_]\w*)/g, "let $1")
    .replace(/arr\.size\s*\(\s*\)/g, "arr.length")
    .replace(/std::/g, "");

  const jsFunctionText =
`return (function(arr) {
  function swap(i, j) {
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  ${jsBody}
  return arr;
})(arr);`;

  try {
    const runner = new Function("arr", jsFunctionText);
    return runner(createSafeArray(inputArray.slice()), input);
  } catch (err) {
    throw new Error("C++ simulation failed: " + err.message);
  }
}


// --------------------------------------------
// MAIN CHECKER
// --------------------------------------------
function checkCode() {
  result.textContent = "Running tests...";

  const tests = [
    [5, 3, 8, 1, 2],
    [10, 9, 8, 7],
    [2, 5, 1, 4, 3],
    [],
    [100, -1, 50, 0]
  ];

  const codeText = codeArea.value;

  // -------------------------
  // JS MODE
  // -------------------------
  if (mode === "js") {
    let userSort;

    try {
      userSort = parseJsFunction(codeText);
    } catch (e) {
      result.textContent = "❌ JavaScript error:\n" + e.message;
      return;
    }

    for (const input of tests) {
      const arrCopy = createSafeArray(input.slice(), input);

      let out;

      try {
        out = userSort(arrCopy);
      } catch (e) {
        result.textContent =
          `❌ Runtime error on [${input}]:\n${e.message}`;
        return;
      }

      const correct = input.slice().sort((a, b) => a - b);

      if (!Array.isArray(out)) {
        result.textContent = `❌ Your function did not return an array.\nInput: [${input}]`;
        return;
      }

      if (out.length !== correct.length) {
        result.textContent =
          `❌ Array length mismatch.\nYour output: [${out}]`;
        return;
      }

      const allGood = out.every((v, i) => v === correct[i]);
      if (!allGood) {
        result.textContent =
          `❌ Wrong result for [${input}].\n\nYour: [${out}]\nCorrect: [${correct}]\n\n${showDiff(out, correct)}`;
        return;
      }
    }

    result.textContent = "✅ All tests passed!";
    return;
  }


  // -------------------------
  // C++ MODE
  // -------------------------
  if (mode === "cpp") {
    for (const input of tests) {
      let out;

      try {
        out = simulateCppSort(codeText, input.slice());
      } catch (e) {
        result.textContent =
          `❌ C++ simulation error on [${input}]:\n${e.message}`;
        return;
      }

      const correct = input.slice().sort((a, b) => a - b);

      if (!Array.isArray(out)) {
        result.textContent =
          `❌ Simulated mySort did not return an array.\nInput: [${input}]`;
        return;
      }

      if (out.length !== correct.length) {
        result.textContent =
          `❌ Array size mismatch.\nYour output: [${out}]`;
        return;
      }

      const allGood = out.every((v, i) => v === correct[i]);
      if (!allGood) {
        result.textContent =
          `❌ Wrong result for [${input}].\n\nYour: [${out}]\nCorrect: [${correct}]\n\n${showDiff(out, correct)}`;
        return;
      }
    }

    result.textContent = "✅ All C++ tests passed!";
  }
}

checkBtn.addEventListener("click", checkCode);
function createSafeArray(arr, testInputName = "") {
  return new Proxy(arr, {
    get(target, prop) {
      if (typeof prop === "string" && /^\d+$/.test(prop)) {
        const index = Number(prop);
        if (index < 0 || index >= target.length) {
          throw new Error(
            `Out-of-bounds access: arr[${index}] does not exist (length = ${target.length})`
            + (testInputName ? ` | Input: [${testInputName}]` : "")
          );
        }
      }
      return target[prop];
    },
    set(target, prop, value) {
      if (typeof prop === "string" && /^\d+$/.test(prop)) {
        const index = Number(prop);
        if (index < 0 || index >= target.length) {
          throw new Error(
            `Out-of-bounds write: arr[${index}] does not exist (length = ${target.length})`
            + (testInputName ? ` | Input: [${testInputName}]` : "")
          );
        }
      }
      target[prop] = value;
      return true;
    }
  });
}
