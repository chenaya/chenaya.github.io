import { getRandomPosition, isSamePosition } from "./utils.js";

export default class Obstacle {
  constructor(gridSize, snake, fruit, existingObstacles) {
    this.gridSize = gridSize;
    this.snake = snake;
    this.fruit = fruit;
    this.existingObstacles = existingObstacles;
    this.position = this.generatePosition();
  }

  generatePosition() {
    let newPos;
    do {
      newPos = getRandomPosition(this.gridSize);
    } while (
      this.snake.some((segment) => isSamePosition(segment, newPos)) ||
      isSamePosition(this.fruit.position, newPos) ||
      this.existingObstacles.some((obs) => isSamePosition(obs.position, newPos))
    );
    return newPos;
  }

  pickLocation() {
    this.position = this.generatePosition();
  }

  draw(ctx, blockSize) {
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.position.x * blockSize,
      this.position.y * blockSize,
      blockSize,
      blockSize
    );
  }
}
