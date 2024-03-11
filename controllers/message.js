const messageModel = require('../models/message.js')
const authModel = require("../models/auth.js");




const messageGET = async (req, res) => {
    try {
      const userId = req.user.userId;
      // createAt alanına göre sıralar
      const allMessages = await messageModel.find()
        .sort({ "message.createAt": -1 }) // -1 büyükten küçüğe sıralar
        .lean();
  
      // __v ve _id alanlarını çıkarır ve istenen formata dönüştürür
      const formattedMessages = allMessages.map((message) => {
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




const messagePOST = async (req, res) => {
    try {
      const { text } = req.body;
      console.log("BODY", req.body)
      const userId = req.user.userId;

  
      const me = await authModel.findById(userId, { password: 0, __v: 0 }).lean();
      // _id alanını userId olarak yeniden adlandırır
      me.userId = me._id;
      delete me._id;
  
      const message = {
        text: text,
      };
  
      const newMessage = (await messageModel.create({ user: me, message })).toObject();
  
      // _id alanını messageId olarak message nesnesinin içine verir
      const { __v, _id, ...rest } = newMessage;
      const { message: Imessage, ...restWithoutMessage } = rest;
      const lastMessage = { ...Imessage, messageId: _id };
      restWithoutMessage.message = lastMessage;
  
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

  module.exports= {messagePOST, messageGET}