const EmfWithGhostCalculator = require("./emfWithGhostCalculator.model");
const EmfWithoutGhostCalculator = require("./emfWithoutGhostCalculator.model");
const Gost = require("./gost.model");
const Hunter = require("./hunter.model");
const ThermostatWithGhost = require("./thermostat-with-ghost");
const ThermostatWithoutGhost = require("./thermostat-without-ghost");

class Game {
	getGost(gostName) {
		const GOSTS = {
			Esprit: new Gost("Esprit", false, true, false),
			Spectre: new Gost("Spectre", true, false, false),
			Fantôme: new Gost("Fantôme", true, false, true),
			Poltergeist: new Gost("Poltergeist", false, false, false),
			Banshee: new Gost("Banshee", true, false, true),
			Revenant: new Gost("Revenant", false, true, true),
			Ombre: new Gost("Ombre", false, true, true),
			Djinn: new Gost("Djinn", false, false, true),
			Cauchemar: new Gost("Cauchemar", true, false, false),
			Démon: new Gost("Démon", true, true, false),
			Yurei: new Gost("Yurei", true, true, false),
			Oni: new Gost("Oni", false, true, true),
			Yokai: new Gost("Yokai", false, true, false),
			Hantu: new Gost("Hantu", false, true, false)
		};
		return GOSTS[gostName];
	}

	constructor() {
		this.ghost                   = null;
		this.tempWithGhostCalculator = null;
		this.tempWithoutGhostCalculator = null;
		this.ghostRoom               = "";
		this.safeZone                = "";
		this.currentRoom             = "";
		this.players                 = [];
	}

	getMentalDecreaseInterval() {
		return this.ghost.name === "Yurei" ? 7000 : 10000;
	}

	groupIsInGhostRoom() {
		return this.currentRoom === this.ghostRoom;
	}

	groupisInSafeRoom() {
		return this.currentRoom === this.safeZone;
	}

	addPlayers(createdPlayer) {
		this.players = [];
		for (const player of createdPlayer) {
			this.players.push(new Hunter(player.name, player.color, this.ghost));
		}
	}

	getTemp() {
		return this.groupIsInGhostRoom()? this.tempWithGhostCalculator.getTemp() : this.tempWithoutGhostCalculator.getTemp();
	}

	getEmfValue() {
		return this.groupIsInGhostRoom() ? this.emfWithGhostCalculator.getEmfValue() : this.emfWithoutGhostCalculator.getEmfValue();
	}

	setGhost(ghostName) {
		this.ghost                      = this.getGost(ghostName);
		this.tempWithGhostCalculator    = new ThermostatWithGhost(this.ghost.isCold);
		this.tempWithoutGhostCalculator = new ThermostatWithoutGhost(this.ghost.isCold);
		this.emfWithGhostCalculator     = new EmfWithGhostCalculator(this.ghost.isEmfMax5 ? 5 : 4);
		this.emfWithoutGhostCalculator  = new EmfWithoutGhostCalculator(this.ghost.isEmfMax5 ? 5 : 4);
	}

	turnPowerOff() {
		this.tempWithGhostCalculator.isPowerOff = true;
		this.tempWithoutGhostCalculator.isPowerOff = true;
	}

	turnPowerOn() {
		this.tempWithGhostCalculator.isPowerOff = false;
		this.tempWithoutGhostCalculator.isPowerOff = false;
	}

	getPlayer(playerName) {
		return this.players.filter(p => p.name === playerName)[0];
	}

	playerDied(playerName) {
		const p = this.getPlayer(playerName);
		p.die();
		for (const player of this.players) {
			player.friendDeath();
		}
	}

	afraidPeople() {
		if (!this.groupisInSafeRoom()) {
			for (const player of this.players) {
				player.fear(this.groupisInSafeRoom());
			}
		}
	}

	startHunting() {
		this.emfWithGhostCalculator.startHunting();
		this.emfWithoutGhostCalculator.startHunting();
	}

	stopHunting() {
		this.emfWithGhostCalculator.recupOldFrequency()
		this.emfWithoutGhostCalculator.isHunting = false;
	}

	getEmfTimeFrequency() {
		return this.emfWithGhostCalculator.getEmfTimeFrequency();
	}
}
module.exports = Game;
