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
} from "./utils.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;
const gridSize = canvas.width / unit;
const score = new Score("level2highestScore");

let obstacles = [];
let gameSpeed = 100;
let myFruit;

alert("Avoid the red blocks \nand collect the yellow ones ");

let snake = createSnake();
myFruit = new Fruit(gridSize, snake, obstacles);
let newObstacle = new Obstacle(gridSize, snake, myFruit, obstacles);
obstacles.push(newObstacle);

window.addEventListener("keydown", changeDirection);
let dir = "Right";
function changeDirection(e) {
  dir = getNewDirection(dir, e);

  window.removeEventListener("keydown", changeDirection);
}

function draw() {
  // 計算新頭座標 先不改動 snake 陣列
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
  } else {
    snake.pop(); // 沒吃到才移除尾巴
  }

  // 每 draw 一次 => 畫布就設定為黑色 => 覆蓋舊蛇
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  myFruit.draw(ctx, unit);
  obstacles.forEach((obs) => obs.draw(ctx, unit));
  drawSnake(ctx, snake, unit);

  window.addEventListener("keydown", changeDirection); //防自殺
}

let myGame = setInterval(draw, gameSpeed);
