const box = document.getElementById("imageBox");
const link = document.getElementById("imageLink");

const images = [
    "images/visualizer.png",
    "images/code-checker.png",
    "images/games.png",
    "images/chatbot.png",
    "images/learning.png"
];

const links = [
    "./sorting_visualizer/index.html",
    "./sorting_checker/index.html",
    "./sorting_visualizer/index.html",
    "./sorting_visualizer/index.html",
    "./theory/index.html",
];

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
