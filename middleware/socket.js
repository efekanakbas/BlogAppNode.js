const { Server } = require('socket.io');

let io;

setupSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    socket.on("room", (data) => {
       
        socket.join(data)
    })

    socket.on('message', async (data) => {
      
        // Bu kısımda mesaj objesi oluşurmak istiyorum

        socket.to(data.room).emit('messageReturn', data);
    })
})

}

module.exports = { setupSocketIO};
