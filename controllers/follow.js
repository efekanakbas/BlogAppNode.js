const authModel = require("../models/auth.js");
const feedModel = require("../models/feed.js");
const { ObjectId } = require("mongodb");

const followPOST = async (req, res) => {
  try {
    const userId = req.user.userId;
    const objectId = new ObjectId(userId);
    const { username } = req.body;
    const me = await authModel.findById(userId, { password: 0, __v: 0 });
    // _id alanını userId olarak yeniden adlandırır
    me.userId = me._id;
    delete me._id;

    // username ile eşleşen kullanıcıları bul
    const users = await authModel.find({ username: username });

    // Eğer kullanıcı bulunamazsa, hata mesajı döndür
    if (users.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "User not found.",
      });
    }

    // username ile eşleşen ilk kullanıcıyı seç
    const user = users[0];

    // followers içinde me var mı diye kontrol eder
    if (
      user.userDetails.followers.some((item) => item.username === me.username)
    ) {
      return res.status(403).json({
        status: "Error",
        message: "You have already followed.",
      });
    }

    // Me'ye takip edileni ekle
    user.userDetails.followers.push(me);

    // User'in followersCount'unu bir arttırır
    user.userDetails.followersCount++;

    // if(commentId) {
    //   // Eğer eşleşen belgeler varsa, followed değerini günceller
    //   const updateExpression = {};

    //   // Dinamik olarak $push operatörü oluşturma
    //   updateExpression.$pull = {};
    //   updateExpression.$pull[`feed.comments.$[elem].user.userDetails.followings`] = { username: me.username };

    //   // Dinamik olarak $inc operatörü oluşturma
    //   updateExpression.$inc = {};
    //   updateExpression.$inc[`feed.comments.$[elem].user.userDetails.followingsCount`] = 1;

    //   const arrayFilters = [{ "elem._id": new ObjectId(commentId) }];

    //   await feedModel.updateMany(
    //     { "user.userId": new ObjectId(objectId) }, // Güncellenmesi gereken belirli kriterler
    //     updateExpression,
    //     { arrayFilters }
    //   );
    //  }

    // Eğer eşleşen belgeler varsa, followed değerini günceller
    await feedModel.updateMany(
      { "user.userId": new ObjectId(user._id) }, // Güncellenmesi gereken belirli kriterler
      {
        // Güncelleme işlemleri
        $push: { "user.userDetails.followers": me }, // Me'ye takip edileni ekle
        $inc: { "user.userDetails.followersCount": 1 }, // User'in followersCount'unu bir arttırır
      }
    );

    // User'i istenilen formata getirir
    const { __v, _id, ...rest } = user;

    rest._doc.userId = _id;

    const {
      __v: ex1,
      _id: ex2,
      password,
      isLogged,
      userDetails,
      ...Irest
    } = rest._doc;

    // Me'ye user'i ekler
    me.userDetails.followings.push(Irest);

    // Me/followingCount'a bir ekler

    me.userDetails.followingsCount++;

    // Eğer eşleşen belgeler varsa, followed değerini günceller
    await feedModel.updateMany(
      { "user.userId": objectId }, // Güncellenmesi gereken belirli kriterler
      {
        // Güncelleme işlemleri
        $push: { "user.userDetails.followings": Irest }, // Me'ye takip edileni ekle
        $inc: { "user.userDetails.followingsCount": 1 }, // User'in followingsCount'unu bir arttırır
      }
    );

    // Değişiklikleri veritabanında güncelle
    await user.save();
    await me.save();

    res.status(200).json({
      status: "Success",
      message: "Follow operation successful.",
    });
  } catch (error) {
    console.error("Occurs an error while creating a follow:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while creating a follow.",
    });
  }
};

const unFollowPOST = async (req, res) => {
  try {
    const userId = req.user.userId;
    const objectId = new ObjectId(userId);
    const { username } = req.body;
    const me = await authModel.findById(userId, { password: 0, __v: 0 });
    // _id alanını userId olarak yeniden adlandırır
    me.userId = me._id;
    delete me._id;

    // username ile eşleşen kullanıcıları bul
    const users = await authModel.find({ username: username });

    // Eğer kullanıcı bulunamazsa, hata mesajı döndür
    if (users.length === 0) {
      return res.status(404).json({
        status: "Error",
        message: "User not found.",
      });
    }

    // username ile eşleşen ilk kullanıcıyı seç
    const user = users[0];

    // followers içinde me var mı diye kontrol eder
    if (
      !user.userDetails.followers.some((item) => item.username === me.username)
    ) {
      return res.status(403).json({
        status: "Error",
        message: "You did not followed or have already unfollowed.",
      });
    }

    // User/followers içindeki followers array'inden me'yi çıkar
    user.userDetails.followers = user.userDetails.followers.filter(
      (item) => item.username !== me.username
    );

    // User/followersCount'dan bir düşer
    user.userDetails.followersCount--;

    // Eğer eşleşen belgeler varsa, followed değerini günceller
    await feedModel.updateMany(
      { "user.userId": new ObjectId(user._id) }, // Güncellenmesi gereken belirli kriterler
      {
        $pull: { "user.userDetails.followers": { username: me.username } }, // User/followers içindeki followers array'inden me'yi çıkar
        $inc: { "user.userDetails.followersCount": -1 }, // User/followersCount'dan bir düşer
      }
    );

    // Me/followings içinden unfollow edileni çıkarır

    me.userDetails.followings = me.userDetails.followings.filter(
      (item) => item.username !== me.username
    );

    // Me/followingCount'dan bir düşer
    me.userDetails.followingsCount--;

    // Eğer eşleşen belgeler varsa, followed değerini günceller
    await feedModel.updateMany(
      { "user.userId": objectId }, // Güncellenmesi gereken belirli kriterler
      {
        $pull: { "user.userDetails.followings": { username: me.username } }, // User/followings içindeki followers array'inden me'yi çıkar
        $inc: { "user.userDetails.followingsCount": -1 }, // User/followingsCount'dan bir düşer
      }
    );

    // Değişiklikleri veritabanında güncelle
    await me.save();
    await user.save();

    res.status(200).json({
      status: "Success",
      message: "Unfollow operation successful.",
    });
  } catch (error) {
    console.error("Occurs an error while creating unfollow:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while creating  unfollow.",
    });
  }
};

module.exports = { followPOST, unFollowPOST };
