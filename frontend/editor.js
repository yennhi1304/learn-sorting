require.config({ paths: { "vs": "https://cdn.jsdelivr.net/npm/monaco-editor/min/vs" }});

require(["vs/editor/editor.main"], function () {

  window.editor = monaco.editor.create(document.getElementById("editor"), {
    value: "def my_sort(arr):\n    return arr\n",
    language: "python",
    theme: "vs-dark",
    fontSize: 16,
  });

  document.getElementById("language").addEventListener("change", e => {
    const lang = e.target.value;
    monaco.editor.setModelLanguage(editor.getModel(), lang);
  });
});


// ------------------------------------------------------------------

async function runCode() {
  const code = editor.getValue();
  const lang = document.getElementById("language").value;
  const output = document.getElementById("output");

  const res = await fetch("http://127.0.0.1:8000/run", {
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
