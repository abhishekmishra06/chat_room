// const express = require('express');
// const app = express();
// const { Server } = require('socket.io');
// const http = require('http');
// const server = http.createServer(app);
// const io = new Server(server);
// const port = 5000;

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

// io.on('connection', (socket) => {
//     socket.on('send name', (username) => {
//         io.emit('send name', (username));
//     });

//     socket.on('send message', (chat) => {
//         io.emit('send message', (chat));
//     });
// });

// server.listen(port, () => {
//     console.log(`Server is listening at the port: ${port}`);
// });


const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors'); 

const app = express();
const server = http.createServer(app);
app.use(cors({
    origin: ['http://127.0.0.1:5501',
        'https://code-eta-one.vercel.app'
    ], // Replace this with your frontend origin
    methods: ['GET', 'POST'],
    credentials: true,
}));

const io = new Server(server, {
    cors: {
        origin:[ 'http://127.0.0.1:5501',
            'https://code-eta-one.vercel.app'
        ], // Replace this with your frontend origin
        methods: ['GET', 'POST'],
    },
});


 
// Store connected users
dotenv.config();
 
const users = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('userJoined', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('userJoined', username); // Notify others
  });

  // Handle chat messages
  socket.on('chatMessage', ({ username, message }) => {
    socket.broadcast.emit('chatMessage', { username, message }); // Broadcast to others
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      console.log(`${username} disconnected`);
      delete users[socket.id];
    }
  });
});

const port = process.env.PORT || 3001;  // Port for local or environment configuration
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// app.use(express.static(__dirname)); // Serve static files

// // Handle client connections
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Listen for chat messages
//   socket.on('chatMessage', (msg) => {
//     console.log('Message received:', msg);
//     // Broadcast the message to all other clients
//     socket.broadcast.emit('chatMessage', msg);
//   });

//   // Handle disconnects
//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// // Start the server
// server.listen(3000, () => {
//   console.log('Server is running on http://localhost:3000');
// });