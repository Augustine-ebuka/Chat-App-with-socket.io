const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('dotenv').config();
const port = process.env.PORT || 3000;
const path = require('path');


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'));
});

var numConnected = 0

// starting the socket here
io.on('connection', (socket) => {

  // count the number of connections
  numConnected += 1

  // Broadcast a message to all connected clients except the one that triggered the event
  socket.broadcast.emit('user-connection', 'a user connected',numConnected);
  
  // for disconnection logic
  socket.on('disconnect', () => {
    numConnected--
    console.log('A user disconnected', numConnected);
    // Broadcast a message to all connected clients except the one that triggered the event
    socket.broadcast.emit('user-disconnected', 'A user has disconnected',numConnected);
  });
  
  // collecting new user event
  socket.on('new user', user_id => {
    socket.broadcast.emit('new user', user_id)
    console.log(user_id);
  })

  // messages event
  socket.on('chat message',(id,msg )=> {
    console.log(`${id}: `,msg);
    io.emit('chat message', id,msg);
  });

// collecting user typing
  socket.on('typingMessage', id => { 
    console.log(`user ${id}...`);
    io.emit('typing', id)
  })
  console.log('total user connected: ', numConnected);
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
