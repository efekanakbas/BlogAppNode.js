const authModel = require("../models/auth.js");
const feedModel = require("../models/feed.js");
const messageModel = require("../models/message.js");
const { ObjectId } = require("mongodb");

const blockedPOST = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user.userId;

    const user = await authModel.findOne(
      { username: username },
      { userDetails: 0, __v: 0, isLogged: 0, password: 0 }
    );

    const user2 = await authModel.findOne({ username: username }, { __v: 0 });

    const me = await authModel.findById(userId, { __v: 0 });

    const me2 = await authModel.findById(userId, {
      __v: 0,
      userDetails: 0,
      isLogged: 0,
      password: 0,
    });

    if (me.userDetails.blocked.some((item) => item.username === username)) {
      res.status(401).json({
        message: "You have already blocked!",
      });
      return;
    }

    //*
    //Mesajı günceller
    await messageModel.updateMany(
      { "user.userId": new ObjectId(userId || user._id) }, // Güncellenmesi gereken belirli kriterler
      {
        // Güncelleme işlemleri
        $push: { "user.userDetails.blocked": user }, // User'i ekle
      }
    );

    await feedModel.updateMany(
      { "user.userId": new ObjectId(userId) }, // Güncellenmesi gereken belirli kriterler
      {
        // Güncelleme işlemleri
        $push: { "user.userDetails.blocked": user }, // User'i ekle
      }
    );

    // Eğer eşleşen belgeler varsa, followed değerini günceller
    const updateExpression = {};

    // Dinamik olarak $push operatörü oluşturma
    updateExpression.$push = {};
    updateExpression.$push[`feed.comments.$[elem].user.userDetails.blockedBy`] =
      me2;

    const arrayFilters = [{ "elem.user.username": username }];

    await feedModel.updateMany(
      { "user.userId": new ObjectId(userId) }, // Güncellenmesi gereken belirli kriterler
      updateExpression,
      { arrayFilters }
    );
    //*

    //!
    //Mesajı günceller
    await messageModel.updateMany(
      { "user.userId": new ObjectId(userId || user._id) }, // Güncellenmesi gereken belirli kriterler
      {
        // Güncelleme işlemleri
        $push: { "user.userDetails.blockedBy": me2 }, // Me'yi ekle
      }
    );

    await feedModel.updateMany(
      { "user.userId": new ObjectId(user._id) }, // Güncellenmesi gereken belirli kriterler
      {
        // Güncelleme işlemleri
        $push: { "user.userDetails.blockedBy": me2 }, // Me'yi ekle
      }
    );

    // Eğer eşleşen belgeler varsa, followed değerini günceller
    const updateExpression2 = {};

    // Dinamik olarak $push operatörü oluşturma
    updateExpression2.$push = {};
    updateExpression2.$push[`feed.comments.$[elem].user.userDetails.blocked`] =
      user;

    const arrayFilters2 = [{ "elem.user.username": me.username }];

    await feedModel.updateMany(
      { "user.userId": new ObjectId(user._id) }, // Güncellenmesi gereken belirli kriterler
      updateExpression2,
      { arrayFilters: arrayFilters2 }
    );

    //!

    me.userDetails.blocked.push(user);
    user2.userDetails.blockedBy.push(me2);

    me.save();
    user2.save();

    res.status(201).json(me);
  } catch (error) {
    console.error("Occurs an error while creating a blocked list:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while creating a blocked list.",
    });
  }
};

const unBlockedPOST = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user.userId;

    const user = await authModel.findOne(
      { username: username },
      { userDetails: 0, __v: 0, isLogged: 0, password: 0 }
    );

    const user2 = await authModel.findOne({ username: username }, { __v: 0 });

    const me = await authModel.findById(userId, { __v: 0 });

    const me2 = await authModel.findById(userId, {
      __v: 0,
      userDetails: 0,
      isLogged: 0,
      password: 0,
    });

    if (me.userDetails.blocked.some((item) => item.username !== username)) {
      res.status(401).json({
        message: "You have already unblocked!",
      });
      return;
    }

    //*
    //Mesajı günceller
    await messageModel.updateMany(
      { "user.userId": new ObjectId(userId || user._id) }, // Güncellenmesi gereken belirli kriterler
      {
        // Güncelleme işlemleri
        $pull: { "user.userDetails.blocked": user }, // User'i çek
      }
    );

    await feedModel.updateMany(
      { "user.userId": new ObjectId(userId) }, // Güncellenmesi gereken belirli kriterler
      {
        // Güncelleme işlemleri
        $pull: { "user.userDetails.blocked": user }, // User'i çek
      }
    );

    // Eğer eşleşen belgeler varsa, followed değerini günceller
    const updateExpression = {};

    // Dinamik olarak $push operatörü oluşturma
    updateExpression.$pull = {};
    updateExpression.$pull[`feed.comments.$[elem].user.userDetails.blockedBy`] =
      me2;

    const arrayFilters = [{ "elem.user.username": username }];

    await feedModel.updateMany(
      { "user.userId": new ObjectId(userId) }, // Güncellenmesi gereken belirli kriterler
      updateExpression,
      { arrayFilters }
    );
    //*

    //!

    //Mesajı günceller
    await messageModel.updateMany(
      { "user.userId": new ObjectId(userId || user._id) }, // Güncellenmesi gereken belirli kriterler
      {
        // Güncelleme işlemleri
        $pull: { "user.userDetails.blockedBy": me2 }, // Me'yi çek
      }
    );

    await feedModel.updateMany(
      { "user.userId": new ObjectId(user._id) }, // Güncellenmesi gereken belirli kriterler
      {
        // Güncelleme işlemleri
        $pull: { "user.userDetails.blockedBy": me2 }, // Me'yi çek
      }
    );

    // Eğer eşleşen belgeler varsa, followed değerini günceller
    const updateExpression2 = {};

    // Dinamik olarak $push operatörü oluşturma
    updateExpression2.$pull = {};
    updateExpression2.$pull[`feed.comments.$[elem].user.userDetails.blocked`] =
      user;

    const arrayFilters2 = [{ "elem.user.username": me.username }];

    await feedModel.updateMany(
      { "user.userId": new ObjectId(user._id) }, // Güncellenmesi gereken belirli kriterler
      updateExpression2,
      { arrayFilters: arrayFilters2 }
    );
    //!

    me.userDetails.blocked = me.userDetails.blocked.filter(
      (blockedUser) => blockedUser._id.toString() !== user._id.toString()
    );
    user2.userDetails.blockedBy = user2.userDetails.blockedBy.filter(
      (blockedByUser) => blockedByUser._id.toString() !== me2._id.toString()
    );

    me.save();
    user2.save();

    res.status(201).json(me);
  } catch (error) {
    console.error("Occurs an error while creating a blocked list:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while creating a blocked list.",
    });
  }
};

const blockedGET = async (req, res) => {
  try {
    const userId = req.user.userId;
    const me = await authModel.findById(userId, { __v: 0 });

    res.status(200).json(me.userDetails.blocked);
  } catch (error) {
    console.error("Occurs an error while fetching blocked list:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while fetching blocked list.",
    });
  }
};

module.exports = { blockedPOST, unBlockedPOST, blockedGET };
