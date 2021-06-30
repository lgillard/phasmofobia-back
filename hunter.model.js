export class Hunter
{
	constructor(name, huntingGhost)
	{
		this.name = name;
		this.mentalScore = 100;
		this.gost = huntingGhost;
		this.isInSafeRoom = true;
	}

	setIsInSafeRoom(isInSafeRoom) {
		this.isInSafeRoom = isInSafeRoom;
	}

	askOuijaQuestion() {
		this.mentalScore -= this.gost.name === 'demon' ? 0 : 15;
	}

	ghostInteract() {
		this.mentalScore -= this.gost.name === 'fantome' ? 15 : 5;
	}

	friendDeath() {
		this.mentalScore -= 50;
	}

	takeMedicine() {
		this.mentalScore += 40;
	}

	/**
	 * Mental score decrease when user is not in the safe room
	 */
	fear() {
		if (!this.isInSafeRoom)
		{
			this.mentalScore --;
		}
	}
}
