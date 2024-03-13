const messageModel = require('../models/message.js')
const authModel = require("../models/auth.js");
const { ObjectId } = require('mongodb');


const messageGET = async (req, res) => {
    try {
      const userId = req.user.userId;
      const objectId = new ObjectId(userId);
      

      // Tüm mesajları kullanıcı ID'lerine göre gruplandır
      const groupedMessages = await messageModel.aggregate([
        {
          $match: {
            $or: [
              { "user.userId": objectId },
              { "message.receiver.userId": userId }
            ]
          }
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$user.userId", objectId] },
                "$message.receiver.userId",
                "$user.userId"
              ]
            },
            messages: { $push: "$$ROOT" }
          }
        }
      ]);

      // Her grup için en son mesajı seç
      const latestMessages = groupedMessages.map(group => {
        const sortedMessages = group.messages.sort((a, b) => new Date(b.message.createAt) - new Date(a.message.createAt));
        return sortedMessages[0]; // En son mesajı seç
      });

      // __v ve _id alanlarını çıkarır ve istenen formata dönüştürür
      const formattedMessages = latestMessages.map((message) => {
        const { __v, _id, ...rest } = message;
        const { message: Imessage, ...restWithoutMessage } = rest;
        // Mesajı kullanıcının atıp atmadığına bakar
        const lastMessage = { ...Imessage, messageId: _id, isMy: message.user.userId.toString() === userId ? true : false };
        restWithoutMessage.message = lastMessage;

        return restWithoutMessage;
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
      const params = req.params.id;
      const userId = req.user.userId;
      const objectId = new ObjectId(userId);
      const paramsObject = new ObjectId(params)
      // createAt alanına göre sıralar
      // Gönderenden mesajları bul
      const senderMessages = await messageModel.find({
        "user.userId": objectId,
        "message.receiver.userId": params
      }).lean();

      // Alıcıdan mesajları bul
      const receiverMessages = await messageModel.find({
        "user.userId": paramsObject,
        "message.receiver.userId": userId
      }).lean();

      // Her iki set mesajı birleştirir
      const allMessages = [...senderMessages, ...receiverMessages];

      // __v ve _id alanlarını çıkarır ve istenen formata dönüştürür
      const formattedMessages = allMessages.map((message) => {
        const { __v, _id, ...rest } = message;
        const { message: Imessage, ...restWithoutMessage } = rest;
        // Mesajı kullanıcının atıp atmadığına bakar
        const lastMessage = { ...Imessage, messageId: _id, isMy: message.user.userId.toString() === userId ? true : false };
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
    const {username, avatar} = await authModel.findById(receiverId, { password: 0, __v: 0 }).lean();
    const userId = req.user.userId;

    const me = await authModel.findById(userId, { password: 0, __v: 0 }).lean();
    // _id alanını userId olarak yeniden adlandırır
    me.userId = me._id;
    delete me._id;

    const message = {
      text: text,
      receiver: {
          userId: receiverId,
          username: username,
          avatar: avatar
      }
    };

    const newMessage = (await messageModel.create({ user: me, message})).toObject();

    // _id alanını messageId olarak message nesnesinin içine verir
    const { __v, _id, ...rest } = newMessage;
    const { message: Imessage, ...restWithoutMessage } = rest;
    const lastMessage = { ...Imessage, messageId: _id };
    restWithoutMessage.message = lastMessage;

    // Gerçek zamanlı olarak mesajı gönder
    // io.to(receiverId).emit('messageReturn', restWithoutMessage);

    res.status(201).json({
      post: restWithoutMessage,
    });
 } catch (error) {
    console.error("Occurs an error while creating a message:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while creating a message.",
    });
 }
};


  module.exports= {messagePOST, messageGET, messageRoomGET}