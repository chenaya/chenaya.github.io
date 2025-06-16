export default class Score {
  constructor(storageKey = "highestScore") {
    this.storageKey = storageKey;
    this.current = 0;
    this.high = 0;
    this.load();
    this.updateScoreUI();
  }

  increase() {
    this.current++;
    if (this.current > this.high) {
      this.high = this.current;
      this.save(); // 破紀錄就save
    }
    this.updateScoreUI();
  }

  reset() {
    this.current = 0;
    this.updateScoreUI();
  }

  load() {
    let stored = localStorage.getItem(this.storageKey);
    if (stored !== null) {
      this.high = Number(stored);
    }
  }

  save() {
    localStorage.setItem(this.storageKey, this.high);
  }

  updateScoreUI() {
    let scoreElement = document.getElementById("myScore");
    let highElement = document.getElementById("myScore2");
    if (scoreElement && highElement) {
      scoreElement.innerHTML = "Game score is " + this.current + " now";
      highElement.innerHTML = "The highest score is " + this.high;
    }
  }

  setGameSpeed(now, delta) {
    let newSpeed = now + delta;
    return newSpeed > 10 ? newSpeed : 10; //如果 newSpeed > 10 => 就回傳 newSpeed；false 則回傳 10
  }
}
