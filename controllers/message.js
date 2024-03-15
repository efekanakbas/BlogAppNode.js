const messageModel = require("../models/message.js");
const authModel = require("../models/auth.js");
const { ObjectId } = require("mongodb");
const { Server } = require("socket.io");

let io;

const setupSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },

    
  });

  io.on("connection", (socket) => {
    socket.on("room", (data) => {
      console.log("SOCKETROOM", data)
       socket.join(data);
    });
   
    socket.on("message", async (data) => {
    //  console.log("message", data)
  
    });
   });
};

const messageGET = async (req, res) => {
  try {
     const userId = req.user.userId;
     const objectId = new ObjectId(userId);
 
     // İlk olarak, tüm mesajları al
     const allMessages = await messageModel.find({
       $or: [
         { "user.userId": objectId },
         { "message.receiver.userId": userId },
       ],
     });
 
     // Ardından, her mesaj için roomId'yi sıralayarak ve birleştirerek gruplandırma
     const groupedMessages = allMessages.reduce((acc, message) => {
       const parts = message.roomId.split('-');
       const sortedRoomId = parts.sort().join('-');
 
       if (!acc[sortedRoomId]) {
         acc[sortedRoomId] = [];
       }
 
       acc[sortedRoomId].push(message);
       return acc;
     }, {});
 
     // Son olarak, her grup için en son mesajı seç
     const formattedMessages = Object.values(groupedMessages).map(messages => {
       const latestMessage = messages.sort((a, b) => new Date(b.message.createAt) - new Date(a.message.createAt))[0];
       const {_doc} = latestMessage;
       const {__v, _id, ...rest} = _doc
       rest.messageId = _id

       return {
         ...rest,
         roomId: rest.roomId,
       };
     });

 
     res.status(200).json(formattedMessages);
  } catch (error) {
     console.error("Occurs an error while fetching messages:", error);
     res.status(500).json({
       status: "Error",
       message: "Occurs an error while fetching messages.",
     });
  }
 };
 
 
 

 const messageRoomGET = async (req, res) => {
  try {
     const roomId = req.params.id;
     // roomId'ye sahip tüm mesajları bul
     const messagesInRoom = await messageModel
       .find({ roomId: roomId })
       .lean();
 
     // __v ve _id alanlarını çıkarır ve istenen formata dönüştürür
     const formattedMessages = messagesInRoom.map((message) => {
       const { __v, _id, ...rest } = message;
       const { message: Imessage, ...restWithoutMessage } = rest;
       // Mesajı kullanıcının atıp atmadığına bakar
       const lastMessage = {
         ...Imessage,
         messageId: _id,
         isMy: message.user.userId.toString() === req.user.userId ? true : false,
       };
       restWithoutMessage.message = lastMessage;
 
       return restWithoutMessage;
     });
 
     // Tarihe göre sıralar
     formattedMessages.sort((a, b) => {
       const dateA = new Date(a.message.createAt).getTime();
       const dateB = new Date(b.message.createAt).getTime();
 
       return dateB - dateA;
     });
 
     res.status(200).json(formattedMessages);
  } catch (error) {
     console.error("Occurs an error while fetching messages:", error);
     res.status(500).json({
       status: "Error",
       message: "Occurs an error while fetching messages.",
     });
  }
 };
 





 const messagePOST = async (req, res) => {
  try {
      const { text, receiverId } = req.body;
      const { username, avatar } = await authModel
        .findById(receiverId, { password: 0, __v: 0 })
        .lean();
        const userId = req.user.userId;
        const roomId = [userId, receiverId].sort().join('-');
  
      const me = await authModel.findById(userId, { password: 0, __v: 0 }).lean();
      me.userId = me._id;
      delete me._id;
  
      const message = {
        text: text,
        receiver: {
          userId: receiverId,
          username: username,
          avatar: avatar,
        },
      };
  
      // Mesajı oluşturun ve kullanıcılara gönderin
      const newMessage = (
        await messageModel.create({ user: me, message, roomId }) // roomId'yi ekleyin
      ).toObject();
  
      // console.log("newMessage", newMessage);
  
      // __v ve _id alanlarını çıkarır ve istenen formata dönüştürür
      const { __v, _id, ...rest } = newMessage;
      const { message: Imessage, ...restWithoutMessage } = rest;
      const {user} = restWithoutMessage
      const lastMessage = { ...Imessage, messageId: _id };
      lastMessage.isMy = user.userId.toString()  === userId ? true : false
      restWithoutMessage.message = lastMessage;
      
  
      res.status(201).json({
        post: restWithoutMessage,
      });
  
      // Mesajın alıcısına gönderin
      console.log("EMİTROOM", roomId)
      io.to(roomId).emit("messageReturn", restWithoutMessage);
  } catch (error) {
      console.error("Occurs an error while creating a message:", error);
      res.status(500).json({
        status: "Error",
        message: "Occurs an error while creating a message.",
      });
  }
 };
 


module.exports = { messagePOST, messageGET, messageRoomGET, setupSocketIO };
