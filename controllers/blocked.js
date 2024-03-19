const blockedModel = require("../models/blocked.js");

const blockedPOST = async (req, res) => {
  try {
    const { userId, avatar, username, text } = req.body;

    const newBlocked = (
      await blockedModel.create({ userId, avatar, username, text })
    ).toObject();

    const {__v, _id, ...formattedBlocked} = newBlocked 

    res.status(201).json({
        post: formattedBlocked,
      });
  } catch (error) 
  {
    console.error("Occurs an error while creating a blocked list:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while creating a blocked list.",
    });
  }
};

const blockedGET = async (req, res) => {
  try {

    const blockedAll = await blockedModel.find().lean();

     // __v ve _id alanlarını çıkarır ve istenen formata dönüştürür
     const formattedBlocked = blockedAll.map((blocked) => {
      const { __v, _id, ...rest } = blocked;

      rest.itemId = _id

      return rest;
    });

    res.status(200).json(formattedBlocked)
  } catch (error) {
    console.error("Occurs an error while fetching blocked list:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while fetching blocked list.",
    });
  }
}

module.exports = {blockedPOST, blockedGET}
