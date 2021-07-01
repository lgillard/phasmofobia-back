class TempCalculator {
	NOISE_SCALE() {
		return 2;
	}
	MAX_WITHOUT_GHOST() {
		17;
	}
	MAX_WITH_GHOST() {
		9;
	}

	constructor(isCold) {
		this.isCold = isCold;
		this.isPowerOff = true;
		this.tempWithoutNoise = 2.5;
		this.temp = 2.5;

		this.minTemp = isCold ? -20 : 0;
	}

	getTemp(isGostPresent) {
		const noise =
				  Math.random() * 2 * TempCalculator.NOISE_SCALE -
				  TempCalculator.NOISE_SCALE; // Number between [-TempCalculator.NOISE_SCALE ; TempCalculator.NOISE_SCALE]
		let res = this.tempWithoutNoise + noise;
		if (res < this.minTemp) {
			res = this.minTemp;
		}

		if (res > TempCalculator.MAX_WITHOUT_GHOST) {
			res = TempCalculator.MAX_WITHOUT_GHOST;
		}

		if (isGostPresent && res > TempCalculator.MAX_WITH_GHOST) {
			res = TempCalculator.MAX_WITH_GHOST;
		}

		this.temp = res;
		this.tempWithoutNoise += this.isPowerOff ? -1 : 1; // Manage increment or decrement

		return Math.round(res * 10) / 10;
	}
}
module.exports = TempCalculator;
