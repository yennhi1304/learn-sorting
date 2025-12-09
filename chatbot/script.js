const messages = document.getElementById("messages");
const input = document.getElementById("input");
const send = document.getElementById("send");

let codeIdCounter = 0;
let chatHistory = loadChat();

// Load past chat history
chatHistory.forEach(m => {
  messages.innerHTML += `
    <div class="${m.sender}">
      ${formatMessage(m.text)}
    </div>
  `;
});
messages.scrollTop = messages.scrollHeight;

// Toggle window
chatBubble.onclick = () => {
  chatWindow.style.display =
    chatWindow.style.display === "flex" ? "none" : "flex";

  if (localStorage.getItem("hidden") === null) {
    localStorage.setItem("hidden", "true");
  } else {
    document.querySelector(".Tony").style.display = "none";
  }
};

const expandBtn = document.getElementById("expandBtn");

send.addEventListener("click", () => sendMessage());
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
document.getElementById("closeChat").onclick = () => {
  chatWindow.style.display = "none";
};


// -----------------------------
// TYPING INDICATOR
// -----------------------------
let typingElement = null;

function showTyping() {
  if (typingElement) return;

  typingElement = document.createElement("div");
  typingElement.className = "bot typing-indicator";
  typingElement.innerHTML = `
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  `;

  messages.appendChild(typingElement);
  messages.scrollTop = messages.scrollHeight;
}

function hideTyping() {
  if (typingElement) {
    typingElement.remove();
    typingElement = null;
  }
}

// -----------------------------
// SEND MESSAGE
// -----------------------------
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  // Display user message
  messages.innerHTML += `<div class="user">${escapeHtml(text)}</div>`;
  messages.scrollTop = messages.scrollHeight;

  chatHistory.push({ sender: "user", text });
  saveChat();

  input.value = "";

  // Show typing animation
  showTyping();

  const API_URL = "https://learn-sorting.onrender.com/chat";

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();

  hideTyping();

  // Navigation logic
  try {
    const action = JSON.parse(data.reply);
    if (action.action && action.url) {
      window.location.href = action.url;
      return;
    }
  } catch (err) {}

  // Display bot reply
  messages.innerHTML += `
    <div class="bot">${formatMessage(data.reply)}</div>
  `;
  messages.scrollTop = messages.scrollHeight;

  chatHistory.push({ sender: "bot", text: data.reply });
  saveChat();
}

// -----------------------------
// MESSAGE PARSER
// -----------------------------
function formatMessage(text) {
  let html = text;

  // Extract code blocks
  const codeBlocks = [];
  html = html.replace(/```([\s\S]*?)```/g, (match, codeText) => {
    const id = "codeblock_" + codeIdCounter++;
    const escaped = escapeHtml(codeText.trim());

    const codeHtml = `
      <div class="code-wrapper">
        <button class="copy-btn" onclick="copyCode('${id}')">Copy</button>
        <pre class="code"><code id="${id}">${escaped}</code></pre>
      </div>
    `;

    codeBlocks.push(codeHtml);

    return `__CODEBLOCK_${codeBlocks.length - 1}__`;
  });

  // Render markdown
  html = marked.parse(html);

  // Replace placeholders
  codeBlocks.forEach((blockHtml, i) => {
    html = html.replace(`__CODEBLOCK_${i}__`, blockHtml);
  });

  // Fallback replacement
  codeBlocks.forEach((blockHtml, i) => {
    html = html.replace(`CODEBLOCK_${i}`, blockHtml);
  });

  return html;
}

// -----------------------------
// Fullscreen button
// -----------------------------
expandBtn.onclick = () => {
  const allCodes = document.querySelectorAll(".code-wrapper");
  const isFullscreen = chatWindow.classList.contains("fullscreen");

  if (!isFullscreen) {
    chatWindow.classList.add("fullscreen");
    messages.classList.add("fullscreen");
    send.classList.add("fullscreen");
    allCodes.forEach(c => c.classList.add("fullscreen"));
    expandBtn.textContent = "_";
  } else {
    chatWindow.classList.remove("fullscreen");
    messages.classList.remove("fullscreen");
    send.classList.remove("fullscreen");
    allCodes.forEach(c => c.classList.remove("fullscreen"));
    expandBtn.textContent = "⛶";
  }
};

// Auto-apply fullscreen class to new messages
const observer = new MutationObserver(() => {
  if (chatWindow.classList.contains("fullscreen")) {
    document.querySelectorAll(".code-wrapper")
      .forEach(c => c.classList.add("fullscreen"));
  }
});
observer.observe(messages, { childList: true, subtree: true });

// -----------------------------
// Utility functions
// -----------------------------
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
}

function copyCode(id) {
  const codeText = document.getElementById(id).innerText.trim();
  navigator.clipboard.writeText(codeText);
  alert("Code copied!");
}

function saveChat() {
  localStorage.setItem("chat-history", JSON.stringify(chatHistory));
}

function loadChat() {
  const raw = localStorage.getItem("chat-history");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Clear chat
document.getElementById("clearChat").onclick = () => {
  if (!confirm("Clear all chat messages?")) return;

  localStorage.removeItem("chat-history");
  localStorage.removeItem("hidden");

  messages.innerHTML = "";
  chatHistory = [];

  alert("Chat cleared!");
};

