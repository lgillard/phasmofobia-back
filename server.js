// Setup
const express = require("express");
const Game = require("./game.model");

const app = express();
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
	cors: {
		origin: "*"
	}
});

const port = process.env.PORT || 3000;

server.listen(port, function() {
	console.log("Server listening at port %d", port);
});

let game = new Game();
let tempLoop;
let mentalLoop;
let emfLoop;
let gameLoop;

const restartEmfLoop = function() {
	if (emfLoop !== null && emfLoop !== undefined) {
		clearInterval(emfLoop);
	}

	emfLoop = setInterval(() => {
		io.emit("EMF_UPD", game.getEmfValue());
		setTimeout(() => {
			io.emit("EMF_UPD", "");
		}, 4000);
	}, game.getEmfTimeFrequency());
};

let stopGame = function() {
	if (tempLoop !== null && tempLoop !== undefined) {
		clearInterval(tempLoop);
	}
	if (mentalLoop !== null && mentalLoop !== undefined) {
		clearInterval(mentalLoop);
	}
	if (emfLoop !== null && emfLoop !== undefined) {
		clearInterval(emfLoop);
	}
	if (gameLoop !== null && gameLoop !== undefined) {
		clearTimeout(gameLoop);
	}
};

const restartGameLoop = function() {
	if (gameLoop !== null && gameLoop !== undefined) {
		clearTimeout(gameLoop);
	}

	gameLoop = setTimeout(stopGame, 20*60*1000);
};

let startGame = function() {
	stopGame();
	tempLoop = setInterval(function() {
		const tmp = game.getTemp();
		io.emit("TEMP_UPD", tmp);
	}, 6000);

	mentalLoop = setInterval(function() {
		game.afraidPeople();
		io.emit("PLAYERS_MENTAL_UPD", game.players);
	}, game.getMentalDecreaseInterval());

	restartEmfLoop();
	restartGameLoop();
	io.emit("PARTY_START");
};

io.on("connection", function(socket) {
	socket.on("PLAYERS_CREATED", createdPlayers => {
		restartGameLoop();
		console.log("PLAYERS_CREATED", createdPlayers);
		game.addPlayers(createdPlayers);
		io.emit("PLAYERS_CREATED", game.players);
	});

	socket.on("PLAYERS_MOVE", room => {
		restartGameLoop();
		console.log("PLAYERS_MOVE", room);

		game.currentRoom = room;
		io.emit("PLAYERS_MOVE", room);
		io.emit("TEMP_UPD", game.getTemp());
	});

	socket.on("GHOST_CHOSEN", ghostName => {
		restartGameLoop();
		console.log("GHOST_CHOSEN", ghostName);
		game.setGhost(ghostName);
		socket.emit("GHOST_CHOSEN", game.ghost);
	});

	socket.on("SAFE_ZONE_CHOSEN", room => {
		restartGameLoop();
		console.log("SAFE_ZONE_CHOSEN", room);
		game.safeZone = room;
		game.currentRoom = room;
		io.emit("SAFE_ZONE_CHOSEN", room);
		io.emit("PLAYERS_MOVE", room);
		startGame();
	});

	socket.on("BOOK_UPD", img => {
		restartGameLoop();
		console.log("BOOK_UPD", img);
		io.emit("BOOK_UPD", img);
	});

	socket.on("GHOST_ZONE_CHOSEN", room => {
		restartGameLoop();
		console.log("GHOST_ZONE_CHOSEN", room);
		game.ghostRoom = room;
		io.emit("GHOST_ZONE_CHOSEN", room);
	});

	socket.on("POWER_OFF", () => {
		restartGameLoop();
		console.log("POWER_OFF");
		game.turnPowerOff();
	});

	socket.on("POWER_ON", () => {
		restartGameLoop();
		console.log("POWER_ON");
		game.turnPowerOn();
	});

	socket.on("OUIJA_INTERACT", playerName => {
		restartGameLoop();
		console.log("OUIJA_INTERACT", playerName);
		game.getPlayer(playerName).askOuijaQuestion();
		io.emit("PLAYERS_MENTAL_UPD", game.players);
	});

	socket.on("GHOST_INTERACT", playerName => {
		restartGameLoop();
		console.log("GHOST_INTERACT", playerName);
		game.getPlayer(playerName).ghostInteract();
		io.emit("PLAYERS_MENTAL_UPD", game.players);
	});

	socket.on("TAKE_MEDICINE", playerName => {
		restartGameLoop();
		console.log("TAKE_MEDICINE", playerName);
		game.getPlayer(playerName).takeMedicine();
		io.emit("PLAYERS_MENTAL_UPD", game.players);
	});

	socket.on("PLAYER_DEATH", playerName => {
		restartGameLoop();
		console.log("PLAYER_DEATH", playerName);
		game.playerDied(playerName);
		io.emit("PLAYERS_MENTAL_UPD", game.players);
	});

	socket.on("HUNTING_STARTED", () => {
		restartGameLoop();
		console.log("HUNTING_STARTED");
		game.startHunting();
		restartEmfLoop();
		setTimeout(() => {
			game.emfCalculator.recupOldFrequency();
			restartEmfLoop();
		}, 20000);
		io.emit("PLAYERS_MENTAL_UPD", game.players);
	});

	socket.on("EMF_FREQUENCY_UPD", frequency => {
		restartGameLoop();
		console.log("EMF_FREQUENCY_UPD", frequency);
		game.emfCalculator.frequency = frequency;
		restartEmfLoop();
	});

	socket.on("RESET_PARTY", () => {
		restartGameLoop();
		console.log("RESET_PARTY");
		clearInterval(tempLoop);
		clearInterval(mentalLoop);

		game = new Game();
		io.emit("NEW_GAME");
	});
});
