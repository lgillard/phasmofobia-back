import { Gost }           from 'gost.model';
import { Hunter }         from 'hunter.model';
import { TempCalculator } from 'tempCalculator';

export class Game {
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
		this.temp           = 5;
		this.players        = [];
	};

	groupIsInGhostRoom() {
		return this.currentRoom === this.ghostRoom;
	}

	addPlayer(playerName) {
		this.players.push(new Hunter(playerName, this.ghost));
	}

	getTemp()
	{
		return this.tempCalculator.getTemp(this.groupIsInGhostRoom());
	}

	setGhost(ghostName) {
		this.ghost = Game.GHOST_LIST[ghostName];
		this.tempCalculator = new TempCalculator(this.ghost.isCold);
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
		// TODO : call friendDeath on each living player
	}
}
