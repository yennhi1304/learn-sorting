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
