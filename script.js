const box = document.getElementById("imageBox");
const link = document.getElementById("imageLink");

// Chatbot elements
const chatWindow = document.getElementById("chatWindow");
const chatBubble = document.getElementById("chatBubble");


const images = [
    "images/visualizer.png",
    "images/code_editor.png",
    "images/games.png",
    "images/chatbot.png",
    "images/learning.png"
];

const links = [
    "./sorting_visualizer/index.html",
    "./code_editor/index.html",
    "./sorting_visualizer/index.html",
    "#",
    "./theory/index.html",
];

// When clicking the slider image
box.addEventListener("click", (event) => {
    // If the current image is the chatbot slide
    if (index === 3) { 
        event.preventDefault();          // stop link navigation
        chatWindow.style.display = "flex";
        handleHiImageOnce();
    }
});

let index = 0;

// Auto timer
let autoTimer = setInterval(() => {
    changeImage(index + 1);
}, 8000);

function changeImage(newIndex) {
    index = (newIndex + images.length) % images.length;

    box.classList.remove("slide");
    void box.offsetWidth;
    box.classList.add("slide");

    box.src = images[index];
    link.href = links[index];   // <-- updates link dynamically
}

function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
}

document.getElementById("prevBtn").onclick = () => {
    stopAuto();
    changeImage(index - 1);
};

document.getElementById("nextBtn").onclick = () => {
    stopAuto();
    changeImage(index + 1);
};


function handleHiImageOnce() {
  const hiTony = document.querySelector(".Tony");

  if (!hiTony) return; // failsafe

  if (localStorage.getItem("hidden") === null) {
    // First time ever opening chatbot → keep "hi" image visible
    localStorage.setItem("hidden", "true");
  } else {
    // Next times → hide the hi gif
    hiTony.style.display = "none";
  }
}
