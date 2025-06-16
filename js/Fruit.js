import { getRandomPosition, isSamePosition } from "./utils.js";

export default class Fruit {
  constructor(gridSize, snake, obstacles) {
    this.gridSize = gridSize;
    this.snake = snake;
    this.obstacles = obstacles;
    this.position = this.generatePosition();
  }

  generatePosition() {
    let newPos;
    do {
      newPos = getRandomPosition(this.gridSize);
    } while (
      this.snake.some((segment) => isSamePosition(segment, newPos)) ||
      this.obstacles.some((obs) => isSamePosition(obs.position, newPos))
    );
    return newPos;
  }

  pickLocation() {
    this.position = this.generatePosition();
  }

  draw(ctx, blockSize) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(
      this.position.x * blockSize,
      this.position.y * blockSize,
      blockSize,
      blockSize
    );
  }
}
