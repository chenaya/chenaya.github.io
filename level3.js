const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;
let gameSpeed = 100;
let isAccelerating = false;
let obstacles = [];

let snake = []; //array中的每個元素，都是一個物件，obj的工作是儲存身體的x,y座標
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickLocation() {
    //不能跟蛇的身體同位置
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          //避免下面do while無限迴圈
          overlapping = false;
        }
      }

      for (let i = 0; i < obstacles.length; i++) {
        if (new_x == obstacles[i].x && new_y == obstacles[i].y) {
          overlapping = true;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

class Obstacle {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawObstacle() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickLocation() {
    //不能跟蛇的身體同位置
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          //避免下面do while無限迴圈
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

function drawBasicGrid(ctx, width, height, cellSize) {
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

//初始設定
createSnake();
let myFruit = new Fruit();
// obstacles[0] = new Obstacle();
obstacles.push(new Obstacle());
window.addEventListener("keydown", changeDirection);
let dir = "Right";
function changeDirection(e) {
  if (e.key == "ArrowUp" && dir != "Down") {
    dir = "Up";
  } else if (e.key == "ArrowDown" && dir != "Up") {
    dir = "Down";
  } else if (e.key == "ArrowRight" && dir != "Left") {
    dir = "Right";
  } else if (e.key == "ArrowLeft" && dir != "Right") {
    dir = "Left";
  }

  // 按住方向鍵 => 加速
  if (
    !isAccelerating &&
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
  ) {
    isAccelerating = true;
    if (gameSpeed > 50) {
      gameSpeedUp(50);
      console.log("speed up to 50");
    } else {
      console.log("no speed up");
    }
  }

  //每次按下上下左右鍵後，在下一幀畫出來之前
  //不接受任何keydown event => 可以防止連續按鍵導致邏輯上自殺
  window.removeEventListener("keydown", changeDirection);
  window.addEventListener("keyup", handleKeyUp);
}

function handleKeyUp(e) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    isAccelerating = false;
    setGameSpeed(gameSpeed);
    console.log("恢復原速度: " + gameSpeed);
  }
}

let highestScore;
loadHighestScore();
let score = 0;

document.getElementById("myScore").innerHTML =
  "Game score is " + score + " now";
document.getElementById("myScore2").innerHTML =
  "The highest score is " + highestScore;

function draw() {
  // 每次畫圖前，確認蛇有無咬到自己
  for (let i = 1; i < snake.length; i++) {
    //i=1 => 從身體第一節開始check
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game over !");
      return;
    }
  }

  //if 撞到障礙物
  for (let i = 0; i < obstacles.length; i++) {
    if (snake[0].x == obstacles[i].x && snake[0].y == obstacles[i].y) {
      clearInterval(myGame);
      alert("Game over !");
      return;
    }
  }

  // 每 draw 一次 => 畫布就設定為黑色 => 覆蓋舊蛇
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBasicGrid(ctx, canvas.width, canvas.height, unit);

  myFruit.drawFruit();
  // 畫出所有障礙物
  obstacles.forEach((obs) => {
    obs.drawObstacle();
  });

  for (let i = 0; i < snake.length; i++) {
    //draw snake
    if (i == 0) {
      ctx.fillStyle = "lightsalmon";
      ctx.strokeStyle = "lightsalmon";
    } else {
      ctx.fillStyle = "lightblue";
      ctx.strokeStyle = "lightblue";
    }

    if (snake[i].x >= canvas.width) {
      snake[i].x = 0; //snake撞到右邊的牆
    }

    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit; //snake撞到左邊的牆
    }

    if (snake[i].y >= canvas.height) {
      snake[i].y = 0; //snake撞到下邊的牆
    }

    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit; //snake撞到上邊的牆
    }

    //ctx.fillRect(x,y,width,height)
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // 以目前的dir變數方向，來決定蛇的下一幀要放在哪個座標 => 蛇 change 座標
  let snakeX = snake[0].x; // snake[0]是一個物件，但snake[0].x是個number
  let snakeY = snake[0].y;
  if (dir == "Left") {
    snakeX -= unit; //不會變動到 snake[0]
  } else if (dir == "Up") {
    snakeY -= unit;
  } else if (dir == "Right") {
    snakeX += unit;
  } else if (dir == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // snake 吃到果實 => snake.unshift()
  // snake 沒吃果實(移動) => snake.unshift()+snake.pop()

  // (吃到果實)建議改成：
  if (newHead.x == myFruit.x && newHead.y == myFruit.y) {
    myFruit.pickLocation(); //重新選位
    score++; //更新分數
    gameSpeed -= 5;
    setGameSpeed(gameSpeed);
    setHighestScore(score);
    document.getElementById("myScore").innerHTML =
      "Game score is " + score + " now";
    document.getElementById("myScore2").innerHTML =
      "The highest score is " + highestScore;
    obstacles.push(new Obstacle());
    // 吃到果實不 pop（蛇會變長）
  } else {
    snake.pop(); // 沒吃到果實就只移動（尾巴消失）
  }

  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, gameSpeed);

function loadHighestScore() {
  if (localStorage.getItem("level3highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("level3highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("level3highestScore", score);
    highestScore = score;
  }
}

function setGameSpeed(newSpeed) {
  if (newSpeed > 5) {
    gameSpeed = newSpeed;
    clearInterval(myGame);
    myGame = setInterval(draw, gameSpeed);
  } else {
    gameSpeed = 5;
    clearInterval(myGame);
    myGame = setInterval(draw, gameSpeed);
  }
}

function gameSpeedUp(fastSpeed) {
  clearInterval(myGame);
  myGame = setInterval(draw, fastSpeed);
}
