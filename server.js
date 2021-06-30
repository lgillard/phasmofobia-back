// Setup
const express  = require('express');
const Game  = require('./game.model');

const app = express();
app.use(function(req, res, next)
		{
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
			next();
		});

const server = require('http').createServer(app);


const io = require('socket.io')(server, {
	cors: {
		origin: '*',
	},
});

const port = process.env.PORT || 3000;

server.listen(port, function()
{
	console.log('Server listening at port %d', port);
});


let game = new Game();
let tempLoop;
let mentalLoop;
let emfLoop;

const restartEmfLoop = function() {
	if(emfLoop !== null && emfLoop !== undefined) {
		clearInterval(emfLoop);
	}

	emfLoop = setInterval(() => {
		io.emit('EMF_UPD', game.getEmfValue());
		setTimeout(()=>{
			io.emit('EMF_UPD', '');
		}, 2000);
	}, game.getEmfTimeFrequency());
}

let startGame = function() {
	tempLoop = setInterval(function(){
		io.emit('TEMP_UPD', game.getTemp());
	}, 10000)

	mentalLoop = setInterval(function(){
		game.afraidPeople();
		io.emit('PLAYERS_MENTAL_UPD', game.players);
	}, game.getMentalDecreaseInterval());

	restartEmfLoop();
};

io.on('connection', function(socket)
{
	socket.on('PLAYERS_CREATED', createdPlayers =>
	{
		console.log('PLAYERS_CREATED', createdPlayers);
		game.addPlayers(createdPlayers);
		io.emit('PLAYERS_CREATED', game.players);
	});

	socket.on('PLAYERS_MOVE', room =>
	{
		console.log('PLAYERS_MOVE', room);

		game.currentRoom = room;
		io.emit('PLAYERS_MOVE', room);
		io.emit('TEMP_UPD', game.getTemp());
	});

	socket.on('GHOST_CHOSEN', ghostName =>
	{
		console.log('GHOST_CHOSEN', ghostName);
		game.setGhost(ghostName);
		io.emit('GHOST_CHOSEN', game.ghost);
	});

	socket.on('SAFE_ZONE_CHOSEN', room =>
	{
		console.log('SAFE_ZONE_CHOSEN', room);
		game.safeZone = room;
		io.emit('SAFE_ZONE_CHOSEN', room);
		startGame();
	});

	socket.on('GHOST_ZONE_CHOSEN', room =>
	{
		console.log('GHOST_ZONE_CHOSEN', room);
		game.ghostRoom = room;
		io.emit('GOST_ZONE_CHOSEN', room);
	});

	socket.on('POWER_OFF', ()=>{
		console.log('POWER_OFF');
		game.turnPowerOff();
	});

	socket.on('POWER_ON', ()=>{
		console.log('POWER_ON');
		game.turnPowerOn();
	});

	socket.on('OUIJA_INTERACT', playerName => {
		console.log('OUIJA_INTERACT', playerName);
		game.getPlayer(playerName).askOuijaQuestion();
		io.emit('PLAYERS_MENTAL_UPD', game.players);
	});

	socket.on('GHOST_INTERACT', playerName => {
		console.log('GHOST_INTERACT', playerName);
		game.getPlayer(playerName).ghostInteract();
		io.emit('PLAYERS_MENTAL_UPD', game.players);
	});

	socket.on('TAKE_MEDICINE', playerName => {
		console.log('TAKE_MEDICINE', playerName);
		game.getPlayer(playerName).takeMedicine();
		io.emit('PLAYERS_MENTAL_UPD', game.players);
	});

	socket.on('PLAYER_DEATH', playerName => {
		console.log('PLAYER_DEATH', playerName);
		game.playerDied(playerName);
		io.emit('PLAYERS_MENTAL_UPD', game.players);
	});

	socket.on('HUNTING_STARTED', () => {
		console.log('HUNTING_STARTED');
		game.startHunting();
		restartEmfLoop();
		io.emit('PLAYERS_MENTAL_UPD', game.players);
	});

	socket.on('EMF_FREQUENCY_UPD', frequency => {
		console.log('EMF_FREQUENCY_UPD', frequency);
		game.emfCalculator.emfFrequency = frequency;
		restartEmfLoop();
	});

	socket.on('RESET_PARTY', () => {
		console.log('RESET_PARTY');
		clearInterval(tempLoop);
		clearInterval(mentalLoop);

		game = new Game();
		io.emit('NEW_GAME');
	});
});
