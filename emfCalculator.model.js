class EmfCalculator {
	EMF_FREQUENCIES(ind) {
		const EMF_FREQUENCIES = [8, 16, 32, 4];
		return EMF_FREQUENCIES[ind];
	}
	constructor(emfMax) {
		this.emfMax = emfMax;
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
	}

	getEmfValue(isGhostPresent) {
		if (this.isHunting || isGhostPresent) {
			this.emfValue = Math.round(Math.random() * this.emfMax);
		} else {
			this.emfValue = 0;
		}
		return this.emfValue;
	}

	getEmfTimeFrequency() {
		return this.EMF_FREQUENCIES(this.frequency) * 1000;
	}
}
module.exports = EmfCalculator;
