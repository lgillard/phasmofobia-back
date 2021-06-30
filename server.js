import { Game }      from 'game.model';
import { TempCalculator } from 'tempCalculator';
import { Hunter }         from 'hunter.model';
import { Gost }           from 'gost.model';

// Setup
const express = require('express');

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

io.on('connection', function(socket)
{
	socket.on('PLAYERS_CREATED', createdPlayers =>
	{
		for(const playerName of createdPlayers) {
			game.addPlayer(playerName);
		}
		io.emit('PLAYERS_CREATED', players);
	});

	socket.on('PLAYERS_MOVE', room =>
	{
		game.currentRoom = room;
		// TODO: setIsInSafeRoom(groupIsInGhostRoom) for each users
		io.emit('PLAYERS_MOVE', room);
		io.emit('TEMP_UPD', game.getTemp());
	});

	socket.on('GHOST_CHOSEN', ghostName =>
	{
		game.setGhost(ghostName);
		io.emit('GHOST_CHOSEN', game.ghost);
	});

	socket.on('SAFE_ZONE_CHOSEN', room =>
	{
		game.safeZone = room;
		io.emit('SAFE_ZONE_CHOSEN', room);
	});

	socket.on('GHOST_ZONE_CHOSEN', room =>
	{
		game.ghostRoom = room;
		io.emit('GOST_ZONE_CHOSEN', room);
	});

	socket.on('POWER_OFF', ()=>{
		game.turnPowerOff();
	});

	socket.on('POWER_ON', ()=>{
		game.turnPowerOn();
	});

	socket.on('OUIJA_INTERACT', playerName => {
		game.getPlayer(playerName).askOuijaQuestion();
		io.emit('PLAYERS_MENTAL_UPD', game.players);
	});

	socket.on('GHOST_INTERACT', playerName => {
		game.getPlayer(playerName).ghostInteract();
		io.emit('PLAYERS_MENTAL_UPD', game.players);
	});

	socket.on('TAKE_MEDICINE', playerName => {
		game.getPlayer(playerName).takeMedicine();
		io.emit('PLAYERS_MENTAL_UPD', game.players);
	});

	socket.on('PLAYER_DEATH', playerName => {
		game.playerDied(playerName);
		io.emit('PLAYERS_MENTAL_UPD', game.players);
	});
});

// TODO: move that function cause will not works if variable not instantiated
setInterval(function(){
	temp = tempCalculator.getTemp(groupIsInGhostRoom());
	io.emit('TEMP_UPD', temp);
}, 30000)

// TODO: move that function cause will not works if variable not instantiated
setInterval(function(){
	temp = tempCalculator.getTemp(groupIsInGhostRoom());
	io.emit('TEMP_UPD', temp);
}, ghostChosen.name === 'Yurei' ? 4000 : 6000);
