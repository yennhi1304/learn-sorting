require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs' }});

require(["vs/editor/editor.main"], function () {

  window.editor = monaco.editor.create(document.getElementById("editor"), {
    value: `# Write your Python or C++ code here`,
    language: "python",
    theme: "vs-dark",
    fontSize: 16,
  });

  document.getElementById("language").addEventListener("change", e => {
    const lang = e.target.value;
    monaco.editor.setModelLanguage(editor.getModel(), lang === "cpp" ? "cpp" : "python");
  });
});

// -------------------------

async function runCode() {
  const code = editor.getValue();
  const lang = document.getElementById("language").value;

 const res = await fetch("https://code-checker-dbjj.onrender.com/run", {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({ code, lang })
});


  const data = await res.json();
  document.getElementById("output").innerText = JSON.stringify(data, null, 2);
}

document.getElementById("runBtn").onclick = runCode;
