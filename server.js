'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');

  // Create function to send status
  const sendStatus = function(status){
    socket.emit('status', status);
  }

  socket.on('disconnect', () => console.log('Client disconnected'));

  socket.on('input', (data) => {
    const name = data.name;
    const message = data.message;

    if (!name || !message) {
      sendStatus('Please enter a name and message');
    } else {
      socket.emit('output', [data]);
      sendStatus('Message sent');
    }
  })
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
