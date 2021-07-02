class _Thermostat {
	NOISE_SCALE() {
		return 2.5;
	}
	_MIN_TEMP() {}
	_MAX_TEMP() {}

	getNoise() {
		return Math.random() * 2 * this.NOISE_SCALE() - this.NOISE_SCALE(); // Number between [-NOISE_SCALE ; NOISE_SCALE]
	}

	constructor(isCold) {
		this.isCold = isCold;
		this.isPowerOff = true;
		this.tempWithoutNoise = 2.5;
		this.temp = this.tempWithoutNoise;
	}

	getTemp() {}
}
module.exports = _Thermostat;
