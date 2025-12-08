const manualBtn = document.getElementById("manualBtn");
const autoBtn = document.getElementById("autoBtn");

const overlay = document.getElementById("modeOverlay");

const manualMode = document.getElementById("manualMode");
const autoMode = document.getElementById("autoMode");

// MANUAL MODE
manualBtn.addEventListener("click", () => {
    overlay.style.display = "none";   // hide overlay
    autoMode.style.display = "none";
    manualMode.style.display = "block";
});

// AUTO MODE
autoBtn.addEventListener("click", () => {
    overlay.style.display = "none";   // hide overlay
    autoMode.style.display = "block";
     manualMode.style.display = "none";
});
