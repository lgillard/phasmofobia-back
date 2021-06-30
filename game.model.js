const EmfCalculator  = require('./emfCalculator.model');
const Gost  = require('./gost.model');
const Hunter  = require('./hunter.model');
const TempCalculator  = require('./tempCalculator');

class Game {
	static GHOST_LIST = {
		'Esprit': new Gost('Esprit', false, true, false),
		'Spectre': new Gost('Spectre', true, false, false),
		'Fantome': new Gost('Fantome', true, false, true),
		'Poltergeist': new Gost('Poltergeist', false, false, false),
		'Banshee': new Gost('Banshee', true, false, true),
		'Revenant': new Gost('Revenant', false, true, true),
		'Ombre': new Gost('Ombre', false, true, true),
		'Djinn': new Gost('Djinn', false, false, true),
		'Cauchemar': new Gost('Cauchemar', true, false, false),
		'Demon': new Gost('Demon', true, true, false),
		'Yurei': new Gost('Yurei', true, true, false),
		'Oni': new Gost('Oni', false, true, true),
		'Yokai': new Gost('Yokai', false, true, false),
		'Hantu': new Gost('Hantu', false, true, false)
	};

	constructor() {
		this.ghost          = null;
		this.tempCalculator = null;
		this.ghostRoom      = '';
		this.safeZone       = '';
		this.currentRoom    = '';
		this.players        = [];
	};

	getMentalDecreaseInterval() {
		return this.ghost.name === 'Yurei' ? 4000 : 6000;
	}

	groupIsInGhostRoom() {
		return this.currentRoom === this.ghostRoom;
	}

	groupisInSafeRoom() {
		return this.currentRoom === this.safeZone;
	}

	addPlayers(createdPlayerNames) {
		for(const playerName of createdPlayerNames)
		{
			this.players.push(new Hunter(playerName, this.ghost));
		}
	}

	getTemp()
	{
		return this.tempCalculator.getTemp(this.groupIsInGhostRoom());
	}

	getEmfValue()
	{
		return this.emfCalculator.getEmfValue(this.groupIsInGhostRoom());
	}

	setGhost(ghostName) {
		this.ghost = Game.GHOST_LIST[ghostName];
		this.tempCalculator = new TempCalculator(this.ghost.isCold);
		this.emfCalculator = new EmfCalculator(this.ghost.isEmfMax5 ? 5 : 4);
	}

	turnPowerOff() {
		this.tempCalculator.isPowerOff = true;
	}

	turnPowerOn() {
		this.tempCalculator.isPowerOff = false;
	}

	getPlayer(playerName) {
		return this.players[playerName];
	}

	playerDied(playerName)
	{
		this.players[playerName] = undefined;
		for(const player of this.players) {
			player.friendDeath();
		}
	}

	afraidPeople()
	{
		if (!this.groupisInSafeRoom())
		{
			for (const player of this.players)
			{
				player.fear(this.groupisInSafeRoom());
			}
		}
	}

	startHunting()
	{
		this.emfCalculator.startHunting();
	}

	getEmfTimeFrequency()
	{
		return this.emfCalculator.getEmfTimeFrequency();
	}
}
module.exports = Game;
