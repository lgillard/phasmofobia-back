const noiseScale = 2;
const MAX_WITHOUT_GOST = 17;
const MAX_WITH_GOST = 9;

export class TempCalculator {
	constructor(isCold) {

		this.isCold = isCold;
		this.isPowerOff = true;
		this.tempWithoutNoise = 2.5;

		this.minTemp = isCold ? -20 : 0;
	}

	getTemp(isGostPresent) {
		const noise = (Math.random()*2*noiseScale) - noiseScale; // Number between [-noiseScale ; noiseScale]
		let res = this.tempWithoutNoise + noise;
		if(res < this.minTemp) {
			res = this.minTemp;
		}

		if(res > MAX_WITHOUT_GOST) {
			res = MAX_WITHOUT_GOST;
		}

		if(isGostPresent && res > this.MAX_WITH_GOST) {
			res = MAX_WITH_GOST;
		}

		this.tempWithoutNoise += this.isPowerOff ? -1 : 1; // Manage increment or decrement

		return Math.round(res*10)/10;
	}
}
