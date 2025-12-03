// Load HTML
fetch("/test/index.html")
  .then(res => res.text())
  .then(html => {
    // 1. Insert chatbot HTML
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    // 2. Load chatbot CSS
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "/test/style.css";
    document.head.appendChild(css);

    // 3. Load chatbot JS
    const script = document.createElement("script");
    script.src = "/test/script.js";
    document.body.appendChild(script);
  });
