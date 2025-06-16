import Fruit from "./Fruit.js";
import Score from "./score.js";
import Obstacle from "./Obstacle.js";
import {
  isSamePosition,
  createSnake,
  wrapPosition,
  drawSnake,
  checkSelfCollision,
  getNextHeadPosition,
  getNewDirection,
  drawBasicGrid,
} from "./utils.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;
const gridSize = canvas.width / unit;
const score = new Score("level3highestScore");
let isAccelerating = false;

let obstacles = [];
let gameSpeed = 100;
let myFruit;
let myGame;
let ready = confirm(
  "Avoid the red blocks \n(they will increase as your score gets higher)\nand collect the yellow ones to earn points!\n\nAre you ready?"
);

if (ready) {
  myGame = setInterval(draw, gameSpeed);
}

//初始設定

let snake = createSnake();
myFruit = new Fruit(gridSize, snake, obstacles);
let newObstacle = new Obstacle(gridSize, snake, myFruit, obstacles);
obstacles.push(newObstacle);

window.addEventListener("keydown", changeDirection);
let dir = "Right";
function changeDirection(e) {
  dir = getNewDirection(dir, e);

  // 按住方向鍵 => 加速
  if (
    !isAccelerating &&
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
  ) {
    isAccelerating = true;
    if (gameSpeed > 50) {
      gameSpeedUp(50); // 加速到50
    } else {
      console.log("no speed up");
    }
  }
  window.removeEventListener("keydown", changeDirection);
  window.addEventListener("keyup", handleKeyUp);
}

function handleKeyUp(e) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    isAccelerating = false;
    gameSpeedUp(gameSpeed);
    console.log("恢復原速度: " + gameSpeed);
  }
}

function draw() {
  console.log(gameSpeed);
  let newHead = getNextHeadPosition(snake[0], dir);
  newHead = wrapPosition(newHead, column, row);
  // 把新頭插到陣列最前面
  snake.unshift(newHead);

  // 每次畫圖前，確認蛇有無咬到自己
  if (checkSelfCollision(snake)) {
    clearInterval(myGame);
    alert("Game over !");
    return;
  }

  if (obstacles.some((obs) => isSamePosition(obs.position, newHead))) {
    clearInterval(myGame);
    alert("Game over !");
    return;
  }

  // 吃到果實
  if (isSamePosition(newHead, myFruit.position)) {
    myFruit.pickLocation();
    score.increase();
    gameSpeed = score.setGameSpeed(gameSpeed, -5);
    score.setGameSpeed(gameSpeed);
    clearInterval(myGame);
    myGame = setInterval(draw, gameSpeed);
    obstacles.push(new Obstacle(gridSize, snake, myFruit, obstacles));
  } else {
    snake.pop(); // 沒吃到才移除尾巴
  }

  // 每 draw 一次 => 畫布就設定為黑色 => 覆蓋舊蛇
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawBasicGrid(ctx, canvas.width, canvas.height, unit);
  myFruit.draw(ctx, unit);
  obstacles.forEach((obs) => obs.draw(ctx, unit));
  drawSnake(ctx, snake, unit);

  window.addEventListener("keydown", changeDirection); //防自殺
}

function gameSpeedUp(fastSpeed) {
  clearInterval(myGame);
  myGame = setInterval(draw, fastSpeed);
}
