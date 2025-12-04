// load-chatbot.js

// Determine how many folders deep we are
const depth = document.location.pathname.split("/").length - 2;

// Build "../" repeated for each level
let base = "";
for (let i = 0; i < depth; i++) {
  base += "../";
}

fetch(base + "chatbot/index.html")
  .then(res => res.text())
  .then(html => {
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = base + "chatbot/style.css";
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.src = base + "chatbot/script.js";
    document.body.appendChild(script);
  });
