const chatBubble = document.getElementById("chatBubble");
const chatWindow = document.getElementById("chatWindow");

const messages = document.getElementById("messages");
const input = document.getElementById("input");
const send = document.getElementById("send");


let codeIdCounter = 0;
let chatHistory = loadChat(); // this is your JS array of objects
// When page loads, render existing history into the UI
chatHistory.forEach(m => {
  messages.innerHTML += `
    <div class="${m.sender}">
      ${formatMessage(m.text)}
    </div>
  `;
});
messages.scrollTop = messages.scrollHeight;

// toggle chatbot window

chatBubble.onclick = () => {
  chatWindow.style.display =
    chatWindow.style.display === "flex" ? "none" : "flex";
  if (localStorage.getItem("hidden") === null) {
    localStorage.setItem("hidden", "true");
  }
  else {
    document.querySelector(".Tony").style.display = "none";
  }

};

const expandBtn = document.getElementById("expandBtn");






// handle sending message
send.addEventListener("click", async () => {
  sendMessage();
});

// allow Enter key
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  // Show user message
  messages.innerHTML += `<div class="user">${escapeHtml(text)}</div>`;
  input.value = "";
  messages.scrollTop = messages.scrollHeight;

  // Save user message
  chatHistory.push({ sender: "user", text });
  saveChat();

  // ---- SEND TO BACKEND ----
  const API_URL = "https://learn-sorting.onrender.com/chat";

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();   // ✔ NOW res EXISTS

  // Try navigation
  try {
    const action = JSON.parse(data.reply);
    if (action.action && action.url) {
      window.location.href = action.url;
      return;
    }
  } catch (e) {}

  // ---- SHOW BOT REPLY ----
  messages.innerHTML += `
    <div class="bot">${formatMessage(data.reply)}</div>
  `;
  messages.scrollTop = messages.scrollHeight;

  // Save bot reply
  chatHistory.push({ sender: "bot", text: data.reply });
  saveChat();
}



function formatMessage(text) {

  // If message contains code block fences
  if (text.includes("```")) {
    return text.replace(/```([\s\S]*?)```/g, (match, codeText) => {
      const id = "codeblock_" + codeIdCounter++;
      const escaped = escapeHtml(codeText.trim());

      return (
        `<div class="code-wrapper">` +
          `<button class="copy-btn" onclick="copyCode('${id}')">Copy</button>` +
          `<pre class="code">` +
            `<code id="${id}">${escaped}</code>` +
          `</pre>` +
        `</div>`
      );
    });
  }

  // Normal text
  return escapeHtml(text).replace(/\n/g, "<br>");
}


expandBtn.onclick = () => {
  const allCodes = document.querySelectorAll(".code-wrapper");

  // Check the actual state of the chat window
  const isFullscreen = chatWindow.classList.contains("fullscreen");

  if (!isFullscreen) {
    chatWindow.classList.add("fullscreen");
    messages.classList.add("fullscreen");
    send.classList.add("fullscreen");
    allCodes.forEach(c => c.classList.add("fullscreen"));
    expandBtn.textContent = "_";  // minimize icon
  } else {
    chatWindow.classList.remove("fullscreen");
    messages.classList.remove("fullscreen");
    send.classList.remove("fullscreen");
    allCodes.forEach(c => c.classList.remove("fullscreen"));
    expandBtn.textContent = "⛶"; // expand icon
  }
};

// Observe the messages container for new nodes
const observer = new MutationObserver(() => {
  if (chatWindow.classList.contains("fullscreen")) {
    document.querySelectorAll(".code-wrapper")
      .forEach(c => c.classList.add("fullscreen"));
  }
});

observer.observe(messages, { childList: true, subtree: true });


function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}



/*copy button*/

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
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Bad chat-history in localStorage:", e);
    return [];
  }
}



/*Clear chat*/
document.getElementById("clearChat").onclick = () => {
  if (!confirm("Clear all chat messages?")) return;

  // Remove all stored messages
  localStorage.removeItem("chat-history");
  localStorage.removeItem("hidden");
  // Clear messages from UI
  messages.innerHTML = "";

  // Reset array in memory
  chatHistory = [];

  alert("Chat cleared!");
};