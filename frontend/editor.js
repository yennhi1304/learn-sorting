require.config({ paths: { "vs": "https://cdn.jsdelivr.net/npm/monaco-editor/min/vs" }});

require(["vs/editor/editor.main"], function () {

  const templates = {
    python: `def my_sort(arr):
    """
    Write a function that returns a sorted version of the list.
    Do not print, do not read input.
    Must return the sorted list.
    """
    return sorted(arr)`,
    
    cpp: `#include <bits/stdc++.h>
using namespace std;

/*
    Implement a function that takes vector<int> and returns sorted vector<int>.
*/

vector<int> mySort(vector<int> arr) {
    sort(arr.begin(), arr.end());
    return arr;
}
`,
    javascript: `function mySort(arr) {
  // return a sorted copy of the array
  return [...arr].sort((a, b) => a - b);
}
`,
  };

  window.editor = monaco.editor.create(document.getElementById("editor"), {
    value: templates.python,
    language: "python",
    theme: "vs-dark",
    fontSize: 16,
  });

  document.getElementById("language").addEventListener("change", e => {
    const lang = e.target.value;
    monaco.editor.setModelLanguage(editor.getModel(), lang);

    // Set correct template automatically
    if (templates[lang]) {
      editor.setValue(templates[lang]);
    }
  });
});



// ------------------------------------------------------------------

async function runCode() {
  const code = editor.getValue();
  const lang = document.getElementById("language").value;
  const output = document.getElementById("output");

  const res = await fetch("https://code-checker-ml8z.onrender.com/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, lang })
  });

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    output.innerText = "❌ Backend returned non-JSON:\n\n" + text;
    return;
  }

  output.innerText = JSON.stringify(data, null, 2);
}

document.getElementById("runBtn").onclick = runCode;
