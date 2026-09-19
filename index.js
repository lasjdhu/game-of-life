const canvas = document.querySelector(".gameCanvas");
const ctx = canvas.getContext("2d");

let cellSize = 15;
let rows = Math.floor(canvas.width / cellSize);
let cols = Math.floor(canvas.height / cellSize);

const game = new Game(rows, cols);

window.onload = () => {
  const drawGrid = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.alive) {
          ctx.fillStyle = "rgba(255, 255, 255, 1)";
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0)";
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      });
    });
  };

  let running = false;
  let drawing = false;

  const isInsideBounds = (event) => {
    const rect = canvas.getBoundingClientRect();
    return (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
  };

  const handleMouseUp = () => {
    drawing = false;
  };

  const handleMouseDown = (event) => {
    if (isInsideBounds(event)) {
      drawing = true;
      handleMouseMove(event);
    } else {
      drawing = false;
    }
  };

  const handleMouseMove = (event) => {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (isInsideBounds(event)) {
      const x = Math.floor((event.clientX - rect.left) * scaleX / cellSize);
      const y = Math.floor((event.clientY - rect.top) * scaleY / cellSize);
      game.grid[x][y].alive = true;
    } else {
      drawing = false;
    }
  };

  const handleRandomize = () => {
    running = false;
    game.randomize();
  };

  const handleClear = () => {
    running = false;
    game.clear();
  };

  const handleStop = () => {
    running = false;
  };

  const handleStart = () => {
    running = true;
  };

  const gameLoop = () => {
    if (running) {
      game.nextGeneration();
      if (game.allCellsDead()) {
        running = false;
      }
    }
  };

  const drawLoop = () => {
    drawGrid();
    requestAnimationFrame(drawLoop);
  };

  document
    .querySelector(".randomizeButton")
    .addEventListener("click", handleRandomize);
  document.querySelector(".clearButton").addEventListener("click", handleClear);
  document.querySelector(".stopButton").addEventListener("click", handleStop);
  document.querySelector(".startButton").addEventListener("click", handleStart);
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("mousemove", handleMouseMove);

  setInterval(gameLoop, 500);
  window.requestAnimationFrame(drawLoop);
};
