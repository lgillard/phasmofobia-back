class TempCalculator {
  NOISE_SCALE() {
    return 2;
  }
  MAX_WITHOUT_GHOST() {
    return 17;
  }
  MAX_WITH_GHOST() {
    return 9;
  }

  constructor(isCold) {
    this.isCold = isCold;
    this.isPowerOff = true;
    this.tempWithoutNoise = 2.5;
    this.temp = 2.5;

    this.minTemp = isCold ? -20 : 0;
  }

  getTemp(isGostPresent) {
    const noise = Math.random() * 2 * this.NOISE_SCALE() - this.NOISE_SCALE(); // Number between [-NOISE_SCALE ; NOISE_SCALE]
    let res = this.tempWithoutNoise + noise;
    if (res < this.minTemp) {
      res = this.minTemp;
    }

    if (res > this.MAX_WITHOUT_GHOST()) {
      res = this.MAX_WITHOUT_GHOST();
    }

    if (isGostPresent && res > this.MAX_WITH_GHOST()) {
      res = this.MAX_WITH_GHOST();
    }
    this.temp = res;
    this.tempWithoutNoise += this.isPowerOff ? -1 : 1; // Manage increment or decrement
    if (this.tempWithoutNoise < 0) {
      this.tempWithoutNoise = 0;
    } else if (this.tempWithoutNoise > 17) {
      this.tempWithoutNoise = 17;
    }

    return Math.round(res * 10) / 10;
  }
}
module.exports = TempCalculator;
