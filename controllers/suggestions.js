const authModel = require("../models/auth.js");
const { ObjectId } = require('mongodb');


const suggestionsGET = async (req, res) => {
  try {

    const userId = req.user.userId;
    const userIdObjectId = new ObjectId(userId);
  
    const me = await authModel.findById(userId , {"__v":0  })
      
    const blockedUsernames = me.userDetails.blocked.map(
      (blockedUser) => blockedUser.username
    );
    const blockedUsernames2 = me.userDetails.blockedBy.map(
      (blockedByUser) => blockedByUser.username
    );

    const allBlockedUsernames = blockedUsernames.concat(blockedUsernames2);

    // userId'ye eşit olmayan belgeleri rastgele sıralayarak döndür
    const randoms = await authModel.aggregate([
      { $match: { _id: { $ne: userIdObjectId }, "username": { $nin: allBlockedUsernames } } }, // Belirli kullanıcı dışındaki ve engellenmemiş belgeleri eşleştir
      { $sample: { size: 6 } } // Rastgele 6 belge döndür
     ]);

    // __v ve _id alanlarını çıkarır ve istenen formata dönüştürür
    const formattedRandom = randoms.map((random) => {
        const { __v, _id, password, userDetails, ...rest } = random;
  
        rest.userId = _id
  
        return rest;
      });
    

    res.status(200).json(formattedRandom);
  } catch (error) {
    console.error("Occurs an error while fetching suggestions:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while fetching suggestions.",
    });
  }
};

module.exports = { suggestionsGET };
