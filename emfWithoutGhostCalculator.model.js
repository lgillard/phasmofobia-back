class EmfWithoutGhostCalculator {
  constructor(emfMax) {
    this.emfMax = emfMax - 1;
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
      this.emfValue = Math.round(Math.random() * this.emfMax) + 1;
    } else {
      this.emfValue = '';
    }
    return this.emfValue;
  }
}
module.exports = EmfWithoutGhostCalculator;
