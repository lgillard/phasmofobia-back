import {Gost} from './gost.model.js';

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

const gosts = {
	'Esprit': new Gost(false, true, false),
	'Spectre': new Gost(true, false, false),
	'Fantôme': new Gost(true, false, true),
	'Poltergeist': new Gost(false, false, false),
	'Banshee': new Gost(true, false, true),
	'Revenant': new Gost(false, true, true),
	'Ombre': new Gost(false, true, true),
	'Djinn': new Gost(false, false, true),
	'Cauchemar': new Gost(true, false, false),
	'Démon': new Gost(true, true, false),
	'Yurei': new Gost(true, true, false),
	'Oni': new Gost(false, true, true),
	'Yokai': new Gost(false, true, false),
	'Hantu': new Gost(false, true, false)
};

let gostChoosen = null;
let gostRoom = '';
let safeZone = '';
let currentRoom = '';
let temp = 5;
let users = []

io.on('connection', function(socket)
{
	socket.on('USERS_CREATED', createdUsers =>
	{
		users = createdUsers;
		io.emit('USERS_CREATED', users);
	});

	socket.on('GROUP_MOVE', room =>
	{
		currentRoom = room;
		io.emit('POSITION_UPD', room);
		io.emit('TEMP_UPD', gostChoosen.getTemp(currentRoom == gostRoom));
	});

	socket.on('GOST_CHOOSEN', gostSelected =>
	{
		gostChoosen = gostSelected;
		io.emit('GOST_CHOOSEN', gosts[gostSelected]);
	});

	socket.on('SAFE_ZONE_CHOOSEN', room =>
	{
		safeZone = room;
		io.emit('SAFE_ZONE_CHOOSEN', room);
	});

	socket.on('GOST_ZONE_CHOOSEN', room =>
	{
		gostRoom = room;
		io.emit('GOST_ZONE_CHOOSEN', room);
	});

	socket.on('POWER_OFF', ()=>{
		gostChoosen.turnPowerOff();
	});

	socket.on('POWER_ON', ()=>{
		gostChoosen.turnPowerOn();
	});
});

setInterval(function(){
	io.emit('TEMP_UPD', gostChoosen.getTemp(currentRoom == gostRoom));
}, 30)
