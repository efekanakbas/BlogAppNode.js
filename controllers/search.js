const authModel = require("../models/auth.js");

const seacrhGET = async (req, res) => {
  try {
    const userId = req.user.userId;
    const params = req.query.params;
    const me = await authModel.findById(userId);
    const query = { "username": { $regex: params, $options: 'i' } };


    response = await authModel.find(query, {userDetails:0 , _id: 0, __v: 0, isLogged: 0, password: 0 });

    filteredResponse = response.filter((item) => item.username !== me.username)


    res.status(200).json(filteredResponse)
  } catch (error) {
    console.error("Occurs an error while fetching searchs:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while fetching  searchs.",
    });
  }
};

const searchDataGET = async (req, res) => {
    try {
      const userId = req.user.userId;
      const params = req.params.params;
      const me = await authModel.findById(userId);
      const query = { "username": { $regex: params, $options: 'i' } };
  
  
      response = await authModel.find(query, {userDetails:0 , _id: 0, __v: 0, isLogged: 0, password: 0 });
  
      filteredResponse = response.filter((item) => item.username !== me.username)
  
  
      res.status(200).json(filteredResponse)
    } catch (error) {
      console.error("Occurs an error while fetching searchs:", error);
      res.status(500).json({
        status: "Error",
        message: "Occurs an error while fetching  searchs.",
      });
    }
  };

module.exports = { seacrhGET, searchDataGET };
