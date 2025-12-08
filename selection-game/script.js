const jsSelectionPlaceholder = `
/// ==============================================
//   Selection Sort Practice (JavaScript Version)
// ==============================================
//
// Your task:
// 1. Write a function named selectionSort(arr)
// 2. Use two loops: the outer loop picks a position,
//    the inner loop finds the smallest value remaining.
// 3. Swap the smallest value into position i.
// 4. Return the sorted array.
//
// Starter template is provided below.
// Fill in the missing logic!
// ----------------------------------------------


function selectionSort(arr) {
    arr = [...arr]; // copy array (optional good practice)

    // TODO: write your selection sort algorithm
    // Hints:
    // - Loop i from 0 to arr.length
    // - Track a minIndex
    // - Inner loop j starts from i + 1
    // - If arr[j] is smaller, update minIndex
    // - Swap arr[i] with arr[minIndex]

    return arr; // return your sorted result
}


// Example test (runs only when you press RUN)
console.log("Testing:", selectionSort([5, 2, 9, 1, 6]));

`;

const pythonSelectionPlaceholder = `
# ==============================================
#   Selection Sort Practice (Python Version)
# ==============================================
#
# Your task:
# 1. Write a function named selectionSort(arr)
# 2. Use two loops: outer loop selects index i,
#    inner loop finds the smallest remaining value.
# 3. Swap the smallest element into position i.
# 4. Return the sorted array.
#
# Starter template provided — now fill it in!
# ----------------------------------------------


def selectionSort(arr):
    arr = arr[:]  # copy input (optional good practice)

    # TODO: implement selection sort here
    # Hints:
    # - Loop i from 0 to len(arr)
    # - Track a min_index
    # - Inner loop j starts from i + 1
    # - If arr[j] < arr[min_index], update min_index
    # - Swap arr[i] and arr[min_index]

    return arr  # return your sorted result


# Test (runs only when you press RUN)
print("Testing:", selectionSort([5, 2, 9, 1, 6]))

`;






// ================= ACE SETUP =================
const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/python");
editor.setValue(
  pythonSelectionPlaceholder,
  -1 // cursor at start
);

editor.setShowPrintMargin(false);

const languageSelect = document.getElementById("language");
const runBtn = document.getElementById("runBtn");
const clearBtn = document.getElementById("clearBtn");
const outputEl = document.getElementById("output");

// ================= HELPERS =================
function clearOutput() {
  outputEl.textContent = "";
}

function appendOutput(text) {
  outputEl.textContent += text;
}

// ================= PYTHON (SKULPT) =================
function builtinRead(x) {
  if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
    throw "File not found: '" + x + "'";
  }
  return Sk.builtinFiles["files"][x];
}

function runPython(code) {
  clearOutput();

  Sk.configure({
    output: appendOutput,
    read: builtinRead,
    __future__: Sk.python3
  });

  // asyncToPromise lets us catch errors in async execution
  Sk.misceval
    .asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true))
    .then(() => {
      // success, nothing extra
    })
    .catch(err => {
      appendOutput("\n[Python Error] " + err.toString() + "\n");
    });
}

// ================= JAVASCRIPT =================
function runJavaScript(code) {
  clearOutput();

  // Local console proxy to capture console.log output
  const localConsole = {
    log: (...args) => {
      appendOutput(args.join(" ") + "\n");
    }
  };

  try {
    // Wrap in Function so we can inject our own console
    const fn = new Function("console", code);
    const result = fn(localConsole);

    // If user returns something explicitly, show it
    if (result !== undefined) {
      appendOutput(String(result) + "\n");
    }
  } catch (err) {
    appendOutput("[JS Error] " + err.toString() + "\n");
  }
}

// ================= EVENT HANDLERS =================
runBtn.addEventListener("click", () => {
  const code = editor.getValue();
  const lang = languageSelect.value;

  if (lang === "python") {
    runPython(code);
  } else if (lang === "javascript") {
    runJavaScript(code);
  }
});

clearBtn.addEventListener("click", clearOutput);

languageSelect.addEventListener("change", () => {
  const lang = languageSelect.value;

  if (lang === "python") {
    editor.session.setMode("ace/mode/python");
    editor.setValue(pythonSelectionPlaceholder, -1);
  } else {
    editor.session.setMode("ace/mode/javascript");
    editor.setValue(jsSelectionPlaceholder, -1);
  }
});


function evaluateSelectionSortJS(code) {
  const testArr = [...arr]; // ← FIXED: use game numbers

  let localConsole = { log: () => {} };

  try {
    const fn = new Function("console", code + "; return selectionSort;");
    const userFunc = fn(localConsole);

    if (typeof userFunc !== "function") {
      return { ok: false, error: "selectionSort() not found." };
    }

    const result = userFunc([...testArr]);
    return { ok: true, result };
  } catch (err) {
    return { ok: false, error: err.toString() };
  }
}


async function evaluateSelectionSortPython(code) {
  const testArr = [...arr]; // ← FIXED

  let resultValue = null;

  Sk.configure({
    output: () => {},
    read: builtinRead,
    __future__: Sk.python3
  });

  const wrapped = `
${code}

__result__ = selectionSort(${JSON.stringify(testArr)})
`;

  try {
    await Sk.misceval.asyncToPromise(() =>
      Sk.importMainWithBody("<stdin>", false, wrapped, true)
    );
    resultValue = Sk.ffi.remapToJs(Sk.globals.__result__);
    return { ok: true, result: resultValue };
  } catch (err) {
    return { ok: false, error: err.toString() };
  }
}



checkBtn.addEventListener("click", async () => {
  const code = editor.getValue();
  const lang = languageSelect.value;

  // Read current game numbers from game.js
  const correct = [...arr].sort((a, b) => a - b);

  let evalResult;

  if (lang === "javascript") {
    evalResult = evaluateSelectionSortJS(code);
  } else {
    evalResult = await evaluateSelectionSortPython(code);
  }

  if (!evalResult.ok) {
    message.textContent = "❌ Error: " + evalResult.error;
    return;
  }

  const userSorted = evalResult.result;

  if (JSON.stringify(userSorted) === JSON.stringify(correct)) {

    message.textContent = "🎉 Correct Selection Sort! You Win! Press Reset to play again.";

    if (typeof setGameArray === "function") {
      setGameArray(userSorted);
    }

    gameOver = true;

  } else {
    message.textContent =
      "❌ Incorrect result:\n" +
      JSON.stringify(userSorted) +
      "\nExpected: " +
      JSON.stringify(correct);
  }
});





function setGameArray(newArr) {
  arr = [...newArr];
  i = arr.length;      
  gameOver = true;           // ⬅ IMPORTANT
  message.textContent = "🎉 Code correct! Blocks sorted automatically!";
  render();
}
