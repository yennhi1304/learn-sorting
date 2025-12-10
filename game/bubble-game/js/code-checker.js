
const jsPlaceholder = `// ==============================================

//   Bubble Sort Practice (JavaScript Version)
// ==============================================

function bubbleSort(arr) {
    #Enter your code
    return arr;
}

// Example test (you may remove this)
// It will run when you press RUN (not Check Sort)
console.log("Testing:", bubbleSort([5, 4, 3, 2, 1]));
`;
const pythonPlaceholder = `# ==============================================
#   Bubble Sort Practice (Python Version)
# ==============================================

def bubbleSort(arr):
    #Enter your code
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

// ========================== CHECK USER BUBBLE SORT ==========================
async function checkCode() {
    const userCode = editor.getValue();
    const lang = languageSelect.value;

    // A few test cases (you can add more)
    const testCases = [
        [9, 3, 7, 1, 4],
        [5, 4, 3, 2, 1],
        [1, 5, 2, 4, 3],
        [3, 1, 2],
        [2, 1],
        Array.from({ length: 6 }, () => Math.floor(Math.random() * 20))
    ];

    const sorted = arr => [...arr].sort((a, b) => a - b);
    const isCorrect = (before, after) =>
        JSON.stringify(after) === JSON.stringify(sorted(before));

    // ========================================================================
    //                               JAVASCRIPT
    // ========================================================================
    if (lang === "javascript") {
        const fakeConsole = { log() {} };
        let bubbleSort;

        try {
            const fn = new Function(
                "console",
                `
${userCode}
return (typeof bubbleSort === 'function') ? bubbleSort : null;
                `
            );
            bubbleSort = fn(fakeConsole);
        } catch (err) {
            console.warn("JS syntax error:", err);
            return false;
        }

        if (!bubbleSort) {
            console.warn("JS: bubbleSort() not found");
            return false;
        }

        for (const t of testCases) {
            let out;
            try {
                out = bubbleSort([...t]);
            } catch (err) {
                console.warn("JS bubbleSort runtime error:", err);
                return false;
            }
            if (!isCorrect(t, out)) return false;
        }

        return true;
    }

    // ========================================================================
    //                                PYTHON
    // ========================================================================
    if (lang === "python") {
        // Build Python list literals from JS arrays
        const pyTestsLiteral =
            "[" +
            testCases
                .map(tc => "[" + tc.join(", ") + "]")
                .join(", ") +
            "]";

        // Python harness that runs INSIDE Skulpt
        const harness = `
__all_tests__ = ${pyTestsLiteral}
__passed__ = True
for __arr in __all_tests__:
    __expected__ = sorted(__arr[:])
    __result__ = bubbleSort(__arr[:])
    if __result__ != __expected__:
        __passed__ = False
        break
`;

        const fullCode = userCode + "\n" + harness + "\n";

        try {
            return await Sk.misceval
                .asyncToPromise(() => {
                    Sk.configure({
                        read: builtinRead,
                        __future__: Sk.python3
                    });

                    // Run user's code + harness
                    const module = Sk.importMainWithBody(
                        "<stdin>",
                        false,
                        fullCode,
                        true
                    );

                    // Just return the module object to .then(...)
                    return module;
                })
                .then(module => {
                    // In your build, $d is a plain JS object with PyObjects as values
                    const passedObj = module.$d["__passed__"];

                    if (!passedObj) {
                        console.warn("Python: __passed__ not set");
                        return false;
                    }

                    // Skulpt bool: .v is the JS boolean
                    return !!passedObj.v;
                })
                .catch(err => {
                    console.warn("Python error in checkCode:", err);
                    return false;
                });
        } catch (err) {
            console.warn("Skulpt crash:", err);
            return false;
        }
    }

    return false;
}
