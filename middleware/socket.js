// const { Server } = require('socket.io');

// let io;

// setupSocketIO = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on('connection', (socket) => {
//     socket.on("room", (data) => {
//         socket.join(data)
//     })

//     socket.on('message', async (data) => {
//         console.log("data", data)
//         socket.emit('messageReturn', data)
//     })
// })

// }

// module.exports = { setupSocketIO, io };
