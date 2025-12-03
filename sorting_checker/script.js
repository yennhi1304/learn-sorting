 // sorting checker elements: buttons and textfields
  const jsBtn    = document.getElementById("jsBtn");
  const cppBtn   = document.getElementById("cppBtn");
  const codeArea = document.getElementById("code");
  const checkBtn = document.getElementById("checkBtn");
  const result   = document.getElementById("result");

  // There are 2 types of mode for users
  // Users can choose their prefered language: css or js
  // Initially, the current mode is js
  let mode = "js";

  // ====== Init default code ======

  // 1. Function setMode: let users change the current mode
        // Change the color of the button when user chose it (active type (css))
        // Change codeArea.value when users switch their states
        // Clear result text area (no need to use it at that time -> clear)
    // End function 1
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




  // set initial content
  // change the current state when users click on 2 buttons


  setMode("js");

  jsBtn.addEventListener("click", () => setMode("js"));
  cppBtn.addEventListener("click", () => setMode("cpp"));



  // 2. A function to compare the difference between the user's array with the correct array
  // and show the difference index, expected and got element
  function showDiff(userArr, correctArr) {
    let lines = [];
    for (let i = 0; i < correctArr.length; i++) {
      if (userArr[i] !== correctArr[i]) {
        lines.push(
          "Index " + i +
          ": expected " + correctArr[i] +
          ", got " + userArr[i]
        );
      }
    }

    // combine all elements in lines into a string, then put \n between them
    return lines.join("\n");
  }



  // Very simple "C++ to JS" simulator for:
  function simulateCppSort(codeText, inputArray) {
    const text = codeText.replace(/\r/g, "");

    // Find the body of mySort
    const match = text.match(/mySort\s*\([^)]*\)\s*{([\s\S]*)}/);
    // If match returns null
    if (!match) {
      throw new Error("Could not find function body of mySort.");
    }

    let body = match[1]; // The first captured group of this match

    // Very basic replacements:
    // - vector<int>  -> (remove, handled by wrapper)
    // - int x;       -> let x;
    // - arr.size()   -> arr.length
    // - std::        -> (remove namespace)
    body = body
      .replace(/vector<int>/g, "")
      .replace(/int\s+([A-Za-z_]\w*)/g, "let $1")
      .replace(/arr\.size\s*\(\s*\)/g, "arr.length")
      .replace(/std::/g, "");

    // Wrap into a JS function that operates on 'arr'
    const jsFunctionText =
      "return (function(arr) {\n" +
      "  function swap(i, j) {\n" +
      "    const t = arr[i];\n" +
      "    arr[i] = arr[j];\n" +
      "    arr[j] = t;\n" +
      "  }\n" +
      body + "\n" +
      "})(arr);";

    // Create a function: (arr) => { ...translated C++ body... }
    // new Function: turn this text into a new function and run it
    const runner = new Function("arr", jsFunctionText);
    return runner(inputArray);
  }

  // ====== Main checker ======
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

    // ----- JavaScript mode -----
    if (mode === "js") {
      let userSort;
      try {
        // codeText should define function mySort(arr) { ... }
        userSort = eval("(" + codeText + ")");
      } catch (e) {
        result.textContent = "❌ JavaScript syntax error:\n" + e.message;
        return;
      }

      for (const input of tests) {
        const arrCopy = input.slice();
        let out;
        try {
          out = userSort(arrCopy);
        } catch (e) {
          result.textContent =
            "❌ Runtime error on input [" + input + "]:\n" + e.message;
          return;
        }

        const correct = input.slice().sort((a, b) => a - b);

        if (!Array.isArray(out)) {
          result.textContent =
            "❌ Your function did not return an array for input [" + input + "].";
          return;
        }

        if (out.length !== correct.length) {
          result.textContent =
            "❌ Array length changed for input [" + input + "].\n" +
            "Your output: [" + out + "]";
          return;
        }

        let allGood = out.every((v, i) => v === correct[i]);
        if (!allGood) {
          result.textContent =
            "❌ Wrong result for input [" + input + "].\n\n" +
            "Your output:   [" + out + "]\n" +
            "Correct output:[" + correct + "]\n\n" +
            showDiff(out, correct);
          return;
        }
      }
      
      result.textContent = "✅ All tests passed!";
      return;
    }

    // ----- Simulated C++ mode -----
    if (mode === "cpp") {
      for (const input of tests) {
        const arrCopy = input.slice();
        let out;
        try {
          out = simulateCppSort(codeText, arrCopy);
        } catch (e) {
          result.textContent =
            "❌ C++ simulation error on input [" + input + "]:\n" + e.message;
          return;
        }

        const correct = input.slice().sort((a, b) => a - b);

        if (!Array.isArray(out)) {
          result.textContent =
            "❌ Simulated mySort did not return an array for input [" + input + "].";
          return;
        }

        if (out.length !== correct.length) {
          result.textContent =
            "❌ Array length changed for input [" + input + "].\n" +
            "Your output: [" + out + "]";
          return;
        }

        let allGood = out.every((v, i) => v === correct[i]);
        if (!allGood) {
          result.textContent =
            "❌ Wrong result for input [" + input + "].\n\n" +
            "Your output:   [" + out + "]\n" +
            "Correct output:[" + correct + "]\n\n" +
            showDiff(out, correct);
          return;
        }
      }

      result.textContent = "✅ All tests passed!";
    }
  }

  checkBtn.addEventListener("click", checkCode);