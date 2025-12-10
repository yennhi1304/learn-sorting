function createSnow() {
  const snow = document.createElement("div");
  snow.className = "snowflake";
  snow.textContent = "❄";

  snow.style.left = Math.random() * 100 + "vw";
  snow.style.animationDuration = (Math.random() * 3 + 4) + "s";
  snow.style.opacity = Math.random();
  snow.style.fontSize = (Math.random() * 10 + 10) + "px";

  document.body.appendChild(snow);

  setTimeout(() => snow.remove(), 8000);
}

setInterval(createSnow, 120);

/* ============================
   STORY / PLOT SYSTEM
============================ */
const stories = {
  bubble: {
    title: "Level 1 – Santa Claus Trapped Under the Sea!",
    text: "A giant icy wave struck Santa’s sleigh and dragged him beneath the North Pole ocean! The sea creatures will only help him escape if he uses Bubble Sort to order the bubbles!",
    link: "../bubble game/index.html"
  },

  quick: {
    title: "Level 2 – Santa Mixed Up All the Christmas Gifts!",
    text: "Santa dropped his gift bag and everything spilled out! He must rearrange the gifts FAST using Quick Sort before morning!",
    link: "../quicksortGame/index.html"
  },

  insertion: {
    title: "Level 3 – Santa Plays Cards to Earn Money!",
    text: "Santa is broke! To earn toy-making money, he enters a magical card contest. He must arrange the cards perfectly using Insertion Sort!",
    link: "../insertionGame/index.html"
  },

  merge: {
    title: "Level 4 – Santa Lost a Magical Book!",
    text: "Santa dropped a precious book inside the giant North Pole Library. Everything is messy! Santa must use Merge Sort to organize the shelves and find it.",
    link: "../merge-/index.html"
  },

  selection: {
    title: "Level 5 – The gift line Is in Chaos!",
    text: "The gift line at the North Pole is crowded and out of order! Santa must hand out gifts from the shortest to the tallest. Use Selection Sort to help him pick the shortest person each time and fix the line!",
    link: "../selection-game/index.html"
  }
};

// Elements
const overlay = document.getElementById("storyOverlay");
const storyTitle = document.getElementById("storyTitle");
const storyText = document.getElementById("storyText");
const playBtn = document.getElementById("playBtn");
const closeBtn = document.getElementById("closeOverlay");

// Show overlay when card clicked
document.querySelectorAll(".game-card").forEach(card => {
  card.addEventListener("click", () => {
    const key = card.dataset.game;
    const info = stories[key];

    storyTitle.textContent = info.title;
    storyText.textContent = info.text;
    playBtn.onclick = () => window.location.href = info.link;

    overlay.classList.add("show");
  });
});

 closeBtn.addEventListener("click", () => {
    overlay.classList.remove("show");
  });
