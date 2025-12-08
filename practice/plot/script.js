const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

const padding = 100;
const width = canvas.width;
const height = canvas.height;

const maxX = 50;
const maxY = maxX * maxX;
const yScale = 0.4;   // shrink vertical height to 40%


// Convert math coordinates → canvas coordinates
function toCanvasCoords(x, y) {
  const px = padding + (x / maxX) * width;

  // scale y so it grows more visibly upward
  const scaledY = y * yScale;

  const py = padding + (1 - scaledY / (maxY * yScale)) * height;
  return { px, py };
}


function drawAxes() {
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1.5;

  // Y-axis
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, padding + height);
  ctx.stroke();

  // X-axis
  ctx.beginPath();
  ctx.moveTo(padding, padding + height);
  ctx.lineTo(padding + width, padding + height);
  ctx.stroke();
}

function drawTicks() {
  ctx.fillStyle = "#e5e7eb";
  ctx.font = "12px system-ui";

  // X-axis ticks (e.g., every 5 units)
  const stepX = 5;
  for (let x = 0; x <= maxX; x += stepX) {
    const { px, py } = toCanvasCoords(x, 0);

    // small vertical tick
    ctx.beginPath();
    ctx.moveTo(px, py - 5);
    ctx.lineTo(px, py + 5);
    ctx.stroke();

    // label
    ctx.fillText(x.toString(), px - 6, py + 20);
  }

  // Y-axis ticks (use n² scale)
  const stepY = 500;  // choose a nice interval
  for (let y = 0; y <= maxY; y += stepY) {
    const { px, py } = toCanvasCoords(0, y);

    // small horizontal tick
    ctx.beginPath();
    ctx.moveTo(px - 5, py);
    ctx.lineTo(px + 5, py);
    ctx.stroke();

    // label
    ctx.fillText(y.toString(), px - 40, py + 4);
  }
}

function drawXSq() {
  ctx.beginPath();

  for (let x = 0; x <= maxX; x++) {
    const y = x * x;
    const { px, py } = toCanvasCoords(x, y);

    if (x === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }

  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
}


function drawnln() {
  ctx.beginPath();

  for (let x = 0; x <= maxX; x++) {
    const y = x * Math.log2(x);
    const { px, py } = toCanvasCoords(x, y);

    if (x === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }

  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawX() {
  ctx.beginPath();

  for (let x = 0; x <= maxX; x++) {
    const y = x;
    const { px, py } = toCanvasCoords(x, y);

    if (x === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();
}

drawAxes();
drawTicks();
drawXSq();
drawnln()
drawX();
