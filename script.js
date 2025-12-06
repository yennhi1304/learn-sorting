// Quick Sort – Cute Partition Game with Matter.js bubbles
window.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // DOM refs
  // -----------------------------
  const arrayView = document.getElementById("arrayView");
  const roundLabel = document.getElementById("roundLabel");
  const pivotLabel = document.getElementById("pivotLabel");
  const waitingListEl = document.getElementById("waitingList");
  const physicsArea = document.getElementById("physicsArea");

  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");
  const undoBtn = document.getElementById("undoBtn");

  const modalOverlay = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalButton = document.getElementById("modalButton");

  // -----------------------------
  // Game state
  // -----------------------------
  let mainArray = [];
  let segments = []; // stack of [l, r]
  let currentSeg = null; // {l, r}
  let waitingQueue = []; // values (without pivot)
  let waitingIndex = 0; // index of next value to send down
  let pivotValue = null;
  let roundNumber = 0;

  let leftValues = [];
  let rightValues = [];

  // For undo & physics removal
  let moveHistory = []; // {side, value, bubbleObj}

  // -----------------------------
  // Matter.js setup
  // -----------------------------
  const Engine = Matter.Engine;
  const World = Matter.World;
  const Bodies = Matter.Bodies;
  const Runner = Matter.Runner;
  const Events = Matter.Events;
  const Composite = Matter.Composite;

  const engine = Engine.create();
  const runner = Runner.create();

  Runner.run(runner, engine);

  const world = engine.world;
  world.gravity.y = 1.2;

  const bubbleRadius = 40; // 80px diameter
  let physicsWidth = physicsArea.clientWidth || 800;
  let physicsHeight = physicsArea.clientHeight || 240;

  // static boundaries
  function setupBoundaries() {
    // Remove all existing bodies then add new static boundaries
    Composite.clear(world, false, true);

    physicsWidth = physicsArea.clientWidth || 800;
    physicsHeight = physicsArea.clientHeight || 240;

    const wallThickness = 20;
    const bucketHeight = physicsHeight * 0.75;
    const bottomY = physicsHeight - 10;
    const centerY = physicsHeight - bucketHeight / 2 - 10;

    const totalWidth = physicsWidth;
    const midX = totalWidth / 2;

    const leftCenterX = totalWidth * 0.25;
    const rightCenterX = totalWidth * 0.75;

    const floorLeft = Bodies.rectangle(
      leftCenterX,
      bottomY,
      totalWidth * 0.38,
      20,
      { isStatic: true }
    );
    const floorRight = Bodies.rectangle(
      rightCenterX,
      bottomY,
      totalWidth * 0.38,
      20,
      { isStatic: true }
    );

    const wallOuterLeft = Bodies.rectangle(
      10,
      centerY,
      wallThickness,
      bucketHeight,
      { isStatic: true }
    );
    const wallOuterRight = Bodies.rectangle(
      totalWidth - 10,
      centerY,
      wallThickness,
      bucketHeight,
      { isStatic: true }
    );
    const wallMiddle = Bodies.rectangle(
      midX,
      centerY,
      wallThickness,
      bucketHeight,
      { isStatic: true }
    );

    World.add(world, [
      floorLeft,
      floorRight,
      wallOuterLeft,
      wallOuterRight,
      wallMiddle,
    ]);
  }

  setupBoundaries();

  // Link physics bodies -> DOM bubbles
  const bubbleViews = []; // {body, el}

  Events.on(engine, "afterUpdate", () => {
    for (const b of bubbleViews) {
      const { x, y } = b.body.position;
      const px = x - bubbleRadius;
      const py = y - bubbleRadius;
      b.el.style.transform = `translate(${px}px, ${py}px)`;
    }
  });

  function clearAllBubbles() {
    for (const b of bubbleViews) {
      World.remove(world, b.body);
      b.el.remove();
    }
    bubbleViews.length = 0;
  }

  function spawnBubble(value, side) {
    const rect = physicsArea.getBoundingClientRect();
    physicsWidth = rect.width || 800;
    physicsHeight = rect.height || 240;

    const baseY = 20;
    const xLeft = physicsWidth * 0.25;
    const xRight = physicsWidth * 0.75;
    const x = side === "left" ? xLeft : xRight;

    const body = Bodies.circle(x, baseY, bubbleRadius * 0.7, {
      restitution: 0.7,
      friction: 0.2,
      frictionAir: 0.02,
    });

    World.add(world, body);

    const el = document.createElement("div");
    el.className = "bubble";
    const img = document.createElement("img");
    img.src = `images/${value}.png`;
    img.alt = String(value);
    el.appendChild(img);
    physicsArea.appendChild(el);

    const viewObj = { body, el };
    bubbleViews.push(viewObj);
    return viewObj;
  }

  function removeBubbleView(obj) {
    const index = bubbleViews.indexOf(obj);
    if (index >= 0) bubbleViews.splice(index, 1);
    World.remove(world, obj.body);
    obj.el.remove();
  }

  // -----------------------------
  // Helpers
  // -----------------------------
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function renderArrayView() {
    arrayView.innerHTML = "";
    mainArray.forEach((v) => {
      const img = document.createElement("img");
      img.src = `images/${v}.png`;
      img.alt = String(v);
      arrayView.appendChild(img);
    });
  }

  // WAITING LINE = các phần tử chưa rơi
  function renderWaitingList() {
    waitingListEl.innerHTML = "";
    for (let i = waitingIndex; i < waitingQueue.length; i++) {
      const v = waitingQueue[i];
      const bubble = document.createElement("div");
      bubble.className = "bubble";
      const img = document.createElement("img");
      img.src = `images/${v}.png`;
      img.alt = String(v);
      bubble.appendChild(img);
      waitingListEl.appendChild(bubble);
    }
  }

  function setControlsEnabled(on) {
    leftBtn.disabled = !on;
    rightBtn.disabled = !on;
    undoBtn.disabled = !on;
  }

  // -----------------------------
  // Modal
  // -----------------------------
  let modalCallback = null;

  function showModal(title, msg, btnLabel = "OK", callback = null) {
    modalTitle.textContent = title;
    modalMessage.innerHTML = msg;
    modalButton.textContent = btnLabel;
    modalCallback = callback;
    modalOverlay.classList.add("show");
  }

  function hideModal() {
    modalOverlay.classList.remove("show");
  }

  modalButton.addEventListener("click", () => {
    hideModal();
    if (typeof modalCallback === "function") {
      modalCallback();
    }
  });

  // -----------------------------
  // Game flow
  // -----------------------------
  function startNewGame() {
    const len = 6;
    mainArray = [];
    for (let i = 0; i < len; i++) {
      mainArray.push(randInt(1, 9));
    }

    segments = [[0, len - 1]];
    roundNumber = 0;
    renderArrayView();
    nextSegment();
  }

  function nextSegment() {
    clearAllBubbles();
    leftValues = [];
    rightValues = [];
    moveHistory = [];
    waitingQueue = [];
    waitingIndex = 0;

    if (segments.length === 0) {
      pivotLabel.textContent = "Array sorted!";
      roundLabel.textContent = "";
      renderWaitingList();
      showModal(
        "Amazing! 🎉",
        "You correctly partitioned all subarrays.<br>Quick Sort is complete and the array is fully sorted!",
        "Play again",
        () => {
          startNewGame();
        }
      );
      return;
    }

    currentSeg = segments.pop();
    const [l, r] = currentSeg;

    if (l >= r) {
      nextSegment();
      return;
    }

    roundNumber++;
    roundLabel.textContent = `Round ${roundNumber} – subarray [${l}, ${r}]`;

    pivotValue = mainArray[r];
    pivotLabel.textContent = `Pivot: ${pivotValue}`;

    waitingQueue = mainArray.slice(l, r); // exclude pivot
    waitingIndex = 0;
    renderWaitingList();
    setControlsEnabled(true);
  }

  function restartCurrentSegment() {
    clearAllBubbles();
    leftValues = [];
    rightValues = [];
    moveHistory = [];
    waitingIndex = 0;
    renderWaitingList();
    setControlsEnabled(true); // 🔥 fix: cho chơi lại round bị sai
  }

  function handleDrop(side) {
    if (waitingIndex >= waitingQueue.length) return;

    const value = waitingQueue[waitingIndex];
    waitingIndex++;

    let targetArr;
    if (side === "left") {
      targetArr = leftValues;
    } else {
      targetArr = rightValues;
    }
    targetArr.push(value);

    const bubbleObj = spawnBubble(value, side);
    moveHistory.push({ side, value, bubbleObj });

    renderWaitingList();

    if (waitingIndex === waitingQueue.length) {
      setControlsEnabled(false);
      setTimeout(checkPartition, 900);
    }
  }

  function handleUndo() {
    if (moveHistory.length === 0) return;

    const last = moveHistory.pop();
    removeBubbleView(last.bubbleObj);

    if (last.side === "left") {
      leftValues.pop();
    } else {
      rightValues.pop();
    }

    waitingIndex--;
    renderWaitingList();
    setControlsEnabled(true);
  }

  function checkPartition() {
    const total = leftValues.length + rightValues.length;
    const shouldTotal = waitingQueue.length;

    const leftOk = leftValues.every((v) => v < pivotValue);
    const rightOk = rightValues.every((v) => v >= pivotValue);

    if (total === shouldTotal && leftOk && rightOk) {
      const [l, r] = currentSeg;
      const merged = [...leftValues, pivotValue, ...rightValues];
      for (let i = 0; i < merged.length; i++) {
        mainArray[l + i] = merged[i];
      }

      const pivotIndex = l + leftValues.length;

      if (pivotIndex - 1 > l) {
        segments.push([l, pivotIndex - 1]);
      }
      if (pivotIndex + 1 < r) {
        segments.push([pivotIndex + 1, r]);
      }

      renderArrayView();

      showModal(
        "Nice job! ✅",
        `Your partition around pivot <b>${pivotValue}</b> is correct.<br>Let's continue sorting the remaining subarrays!`,
        "Next",
        () => {
          nextSegment();
        }
      );
    } else {
      showModal(
        "Oops… ❌",
        "This partition is not correct.<br>Remember:<br><b>Left</b> bucket must contain values &lt; pivot,<br><b>Right</b> bucket values ≥ pivot.",
        "Try again",
        () => {
          restartCurrentSegment();
        }
      );
    }
  }

  // -----------------------------
  // Button events
  // -----------------------------
  leftBtn.addEventListener("click", () => handleDrop("left"));
  rightBtn.addEventListener("click", () => handleDrop("right"));
  undoBtn.addEventListener("click", handleUndo);

  // -----------------------------
  // First instructions
  // -----------------------------
  showModal(
    "Welcome! 💡",
    `
This is a cute <b>Quick Sort</b> partition game.<br><br>
1. Look at the <b>pivot</b> number at the top.<br>
2. For each number in the waiting line, choose:<br>
&ensp;• <b>Left</b> if it is &lt; pivot<br>
&ensp;• <b>Right</b> if it is ≥ pivot<br>
3. The numbers will fall like bouncy balls into the buckets.<br>
4. When all numbers are placed, I'll check your partition.<br><br>
If it's correct, we continue with the next subarray until the whole array is sorted!
    `,
    "I understand!",
    () => {
      startNewGame();
    }
  );

  // Rebuild boundaries if window size changes a lot
  window.addEventListener("resize", () => {
    setupBoundaries();
  });
});
