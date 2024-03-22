const authModel = require("../models/auth.js");


const detailsGET = async (req, res) => {
try {
    const username = req.params.username;
    const user = await authModel.findOne({
          username: username 
      });
    
    if(!user) {
        return res.status(404).json({
            message: "User not found.",
          });
    }

    console.log("user", user)

    const { __v, _id, ...rest } = user;
  
    rest._doc.userId = _id

    const {__v: ex1, _id: ex2, password, isLogged, ...Irest} = rest._doc
  
    

    




     res.status(200).json(Irest)
} catch (error) {
    console.error("Occurs an error while fetching details:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while fetching  details.",
    });
}





}

module.exports = {detailsGET}