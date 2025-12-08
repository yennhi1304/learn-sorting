const jsPlaceholder = `// ==============================================
//   Bubble Sort Practice (JavaScript Version)
// ==============================================
//
// Your task:
// 1. Study the bubbleSort() function below.
// 2. Modify it if needed.
// 3. Press RUN or CHECK SORT to test your function.
// ----------------------------------------------

function bubbleSort(arr) {
    arr = [...arr]; // clone input for safety
    let n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {

            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {

                // Swap
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}

// Example test (you may remove this)
// It will run when you press RUN (not Check Sort)
console.log("Testing:", bubbleSort([5, 4, 3, 2, 1]));

// Now press RUN ▶
`;
const pythonPlaceholder = `# ==============================================
#   Bubble Sort Practice (Python Version)
# ==============================================
#
# Your task:
# 1. Study the bubbleSort() function below.
# 2. Modify it if needed.
# 3. Press RUN or CHECK SORT to test your function.
# ----------------------------------------------

def bubbleSort(arr):
    arr = arr[:]  # copy input
    n = len(arr)

    for i in range(n - 1):
        for j in range(n - i - 1):

            # Compare adjacent elements
            if arr[j] > arr[j + 1]:

                # Swap
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

    return arr

# Example test (runs only when you press RUN)
print("Testing:", bubbleSort([5, 4, 3, 2, 1]))

# Now press RUN ▶
`;


// ================= ACE SETUP =================
const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/python");
editor.setValue(
pythonPlaceholder,
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
        editor.setValue(pythonPlaceholder, -1);
    } else {
        editor.session.setMode("ace/mode/javascript");
        editor.setValue(jsPlaceholder, -1);
    }
});
