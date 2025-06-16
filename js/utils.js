export function createSnake() {
  return [
    { x: 4, y: 0 },
    { x: 3, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 0 },
  ];
}

export function getRandomPosition(gridSize) {
  let x = Math.floor(Math.random() * gridSize);
  let y = Math.floor(Math.random() * gridSize);
  return { x, y };
}

export function isSamePosition(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

export function wrapPosition(pos, maxX, maxY) {
  if (pos.x >= maxX) pos.x = 0;
  if (pos.x < 0) pos.x = maxX - 1;
  if (pos.y >= maxY) pos.y = 0;
  if (pos.y < 0) pos.y = maxY - 1;
  return pos;
}

export function drawSnake(ctx, snake, unit) {
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lightgreen" : "lightblue";
    ctx.strokeStyle = "white";
    ctx.fillRect(snake[i].x * unit, snake[i].y * unit, unit, unit);
    ctx.strokeRect(snake[i].x * unit, snake[i].y * unit, unit, unit);
  }
}

export function checkSelfCollision(snake) {
  //i=1 => 從身體第一節開始check
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}

export function getNewDirection(currentDirection, keyEvent) {
  let key = keyEvent.key;
  if (key === "ArrowUp" && currentDirection !== "Down") {
    return "Up";
  } else if (key === "ArrowDown" && currentDirection !== "Up") {
    return "Down";
  } else if (key === "ArrowRight" && currentDirection !== "Left") {
    return "Right";
  } else if (key === "ArrowLeft" && currentDirection !== "Right") {
    return "Left";
  }
  return currentDirection; // 沒有變化
}

export function getNextHeadPosition(currentHead, direction) {
  let { x, y } = currentHead;
  switch (direction) {
    case "Left":
      x -= 1;
      break;
    case "Right":
      x += 1;
      break;
    case "Up":
      y -= 1;
      break;
    case "Down":
      y += 1;
      break;
  }
  return { x, y };
}

export function drawBasicGrid(ctx, width, height, cellSize) {
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  ctx.strokeStyle = "white";

  for (let i = 0; i <= width; i += cellSize) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }

  for (let i = 0; i <= height; i += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }
}
