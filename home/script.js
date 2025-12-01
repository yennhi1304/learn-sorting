const box = document.getElementById("imageBox");

const images = [
    "images/sorting-visualization.gif",
    "images/code-checker.gif",
    "images/games.gif",
     "images/chatbot.gif",
    "images/learning.gif"
];

let index = 0;

// Start automatic timer
let autoTimer = setInterval(() => {
    changeImage(index + 1);
}, 8000);

// Function to change image + animate
function changeImage(newIndex) {
    index = (newIndex + images.length) % images.length;

    box.classList.remove("slide");
    void box.offsetWidth; // reset animation
    box.classList.add("slide");

    box.src = images[index];
}

// Stop auto animation when user interacts
function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null; // optional, prevents restarting
}

// Manual controls
document.getElementById("prevBtn").onclick = () => {
    stopAuto();
    changeImage(index - 1);
};

document.getElementById("nextBtn").onclick = () => {
    stopAuto();
    changeImage(index + 1);
};
