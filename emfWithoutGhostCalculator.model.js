class EmfWithoutGhostCalculator {
  constructor(emfMax) {
    this.emfMax = emfMax;
    this.emfValue = 0;
    this.isHunting = false;
  }

  startHunting() {
    if (!this.isHunting) {
      this.isHunting = true;
    }
  }

  getEmfValue() {
    if (this.isHunting) {
      this.emfValue = Math.round(Math.random() * this.emfMax);
    } else {
      this.emfValue = 0;
    }
    return this.emfValue;
  }
}
module.exports = EmfWithoutGhostCalculator;
