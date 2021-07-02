class EmfWithGhostCalculator {
  EMF_FREQUENCIES(ind) {
    const EMF_FREQUENCIES = [32, 16, 8, 4];
    return EMF_FREQUENCIES[ind];
  }
  constructor(emfMax) {
    this.emfMax = emfMax - 1;
    this.frequency = 1;
    this.emfValue = 0;
    this.isHunting = false;
  }

  startHunting() {
    if (!this.isHunting) {
      this.oldEmfFrequency = this.frequency;
      this.frequency = 3;
      this.isHunting = true;
    }
  }

  recupOldFrequency() {
    this.frequency = this.oldEmfFrequency;
    this.isHunting = false;
  }

  getEmfValue() {
    this.emfValue = Math.round(Math.random() * this.emfMax) + 1;
    return this.emfValue;
  }

  getEmfTimeFrequency() {
    return this.EMF_FREQUENCIES(this.frequency) * 1000;
  }
}
module.exports = EmfWithGhostCalculator;
