const authModel = require("../models/auth.js");

const followPOST = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username } = req.body;
    const me = await authModel
      .findById(userId, { password: 0, __v: 0})
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
    const { username } = req.body;
    const me = await authModel
      .findById(userId, { password: 0, __v: 0})
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

    // Me/followings içinden unfollow edileni çıkarır

    me.userDetails.followings = me.userDetails.followings.filter(
      (item) => item.username !== me.username
    );

    // Me/followingCount'dan bir düşer
    me.userDetails.followingsCount--;

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
