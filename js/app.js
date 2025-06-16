import Fruit from "./Fruit.js";
import Score from "./score.js";
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
const ctx = canvas.getContext("2d"); //getContext() 會回傳一個canvas的drawing context
//drawing context可以用在canvas內繪圖
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;
const gridSize = canvas.width / unit; //每一格單位
const score = new Score();

let snake = createSnake(); //array中的每個元素，都是一個物件，obj的工作是儲存身體的x,y座標
let obstacles = [];
let myFruit = new Fruit(gridSize, snake, obstacles);

//初始設定
window.addEventListener("keydown", changeDirection);
let dir = "Right";
function changeDirection(e) {
  dir = getNewDirection(dir, e);

  // 避免連續觸發
  window.removeEventListener("keydown", changeDirection);
}

score.updateScoreUI();

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

  // 吃到果實
  if (isSamePosition(newHead, myFruit.position)) {
    myFruit.pickLocation();
    score.increase();
  } else {
    snake.pop(); // 沒吃到才移除尾巴
  }

  // 每 draw 一次 => 畫布就設定為黑色 => 覆蓋舊蛇
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  myFruit.draw(ctx, unit);
  drawSnake(ctx, snake, unit);

  window.addEventListener("keydown", changeDirection); //防自殺
}

let myGame = setInterval(draw, 100); //setInterval 每隔一段時間重複執行某個function
