const _Thermostat = require('./thermostat');

class ThermostatWithoutGhost extends _Thermostat
{
  constructor(isCold)
  {
    super(isCold);
  }
  _MIN_TEMP() {
    return 2.5
  }
  _MAX_TEMP() {
    return 16;
  }

  getTemp() {
    if(this.isPowerOff && this.tempWithoutNoise>this._MIN_TEMP()) {
      this.tempWithoutNoise -= 0.5;
    } else if(!this.isPowerOff && this.tempWithoutNoise<this._MAX_TEMP()) {
      this.tempWithoutNoise += 0.5;
    }
    this.temp = Math.round((this.tempWithoutNoise + this.getNoise()) * 10) / 10;
    return this.temp;
  }
}
module.exports = ThermostatWithoutGhost;
