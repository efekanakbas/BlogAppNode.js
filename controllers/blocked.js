const authModel = require("../models/auth.js");
const feedModel = require("../models/feed.js");
const { ObjectId } = require("mongodb");

const blockedPOST = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user.userId

    

    const user = await authModel.findOne({ "username": username }, { "userDetails": 0, "__v":0, "isLogged":0, "password": 0  });

    const me = await authModel.findById(userId , {"__v":0  });

    

    if(me.userDetails.blocked.some((item) => item.username === username)) {
      res.status(401).json({
        message: "You have already blocked!"
      })
      return
    }

    await feedModel.updateMany(
      { "user.userId": new ObjectId(userId) }, // Güncellenmesi gereken belirli kriterler
      {
        // Güncelleme işlemleri
        $push: { "user.userDetails.blocked": user }, // Me'yi ekle
      }
    );

    me.userDetails.blocked.push(user)

    me.save()


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
    const userId = req.user.userId
    const me = await authModel.findById(userId , {"__v":0  });


    res.status(200).json(me.userDetails.blocked);
  } catch (error) {
    console.error("Occurs an error while fetching blocked list:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while fetching blocked list.",
    });
  }
};

module.exports = { blockedPOST, blockedGET };
