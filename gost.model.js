import {TempCalculator} from './tempCalculator.js';

export class Gost {
	constructor(isCold, canWrite, isEmfMax5)  {
		this.isCold = isCold;
		this.canWrite =  canWrite;
		this.isEmfMax5 = isEmfMax5;
		this.tempCalculator = new TempCalculator(isCold);
	}

	turnPowerOff() {
		this.tempCalculator.setIsPowerOff(true);
	}

	turnPowerOn() {
		this.tempCalculator.setIsPowerOff(false);
	}

	getTemp(isGostPresent) {
		this.tempCalculator.getTemp(isGostPresent);
	}
}
