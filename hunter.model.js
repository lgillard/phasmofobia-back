class Hunter
{
	constructor(name, color, huntingGhost)
	{
		this.name = name;
		this.mentalScore = 100;
		this.gost = huntingGhost;
		this.color = color;
		this.isDead = false;
	}

	askOuijaQuestion() {
		this.mentalScore -= this.gost.name === 'Démon' ? 0 : 15;
	}

	ghostInteract() {
		this.mentalScore -= this.gost.name === 'Fantôme' ? 15 : 5;
	}

	die() {
		this.isDead = true;
	}

	friendDeath() {
		this.mentalScore -= 50;
	}

	takeMedicine() {
		this.mentalScore += 40;
		if(this.mentalScore > 100) {
			this.mentalScore = 100;
		}
	}

	/**
	 * Mental score decrease when user is not in the safe room
	 */
	fear() {
		this.mentalScore --;
	}
}
module.exports = Hunter;

