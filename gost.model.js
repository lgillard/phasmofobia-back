import {TempCalculator} from './tempCalculator.js';

export class Gost {
	constructor(name, isCold, canWrite, isEmfMax5)  {
		this.name = name;
		this.isCold = isCold;
		this.canWrite =  canWrite;
		this.isEmfMax5 = isEmfMax5;
	}
}
