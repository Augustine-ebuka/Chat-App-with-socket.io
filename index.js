const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('dotenv').config();
const port = process.env.PORT || 3000;
const path = require('path');


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'));
});
var numConnected  = 0
io.on('connection', (socket) => {
  numConnected += 1
  socket.on('new user', user_id=>{
    console.log(user_id);
  })
  console.log('connected',numConnected);
   // Broadcast a message to all connected clients except the one that triggered the event
  socket.broadcast.emit('connection', 'a user connected',numConnected);

  // for disconnection
  socket.on('disconnect', () => {
    numConnected--
    console.log('A user disconnected', numConnected);
    // Broadcast a message to all connected clients except the one that triggered the event
    socket.broadcast.emit('user-disconnected', 'A user has disconnected',numConnected);
  });
  socket.on('chat message',(id,msg )=> {
    console.log(id,msg);
    io.emit('chat message', id,msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
