export class EmfCalculator {
	static EMF_FREQUENCIES = [
		8,
		16,
		32,
		2
	]
	constructor(emfMax)
	{
		this.emfMax = emfMax;
		this.frequency = 1;
		this.emfValue = 0;
		this.isHunting = false;
	}

	startHunting() {
		if(!this.isHunting)
		{
			const oldEmfFrequency = this.frequency;
			this.frequency     = 3;
			this.isHunting        = true;

			setTimeout(() =>
					   {
						   this.frequency = oldEmfFrequency;
					   }, 20000);
		}
	}

	getEmfValue(isGhostPresent) {
		if (this.isHunting || isGhostPresent) {
			this.emfValue = Math.round(Math.random() * this.emfMax);
		} else {
			this.emfValue = 0;
		}
		return this.emfValue;
	}

	getEmfTimeFrequency()
	{
		return EmfCalculator.EMF_FREQUENCIES[this.frequency] * 1000;
	}
}
