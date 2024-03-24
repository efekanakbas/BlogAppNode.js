const authModel = require("../models/auth.js");

const detailsGET = async (req, res) => {
  try {
    const userId = req.user.userId;
    const username = req.params.username;
    const user = await authModel.findOne({
      username: username,
    });
    const me = await authModel
      .findById(userId, { password: 0, __v: 0, userDetails: 0 })
      .lean();
    // _id alanını userId olarak yeniden adlandırır
    me.userId = me._id;
    delete me._id;

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // console.log("user", user);

    const { __v, _id, ...rest } = user;

    rest._doc.userId = _id;

    const { __v: ex1, _id: ex2, password, isLogged, ...Irest } = rest._doc;

    if (
      user.userDetails.followers.some((item) => item.username === me.username)
    ) {
      Irest.isFollowed = true;
    } else {
      Irest.isFollowed = false;
    }

    res.status(200).json(Irest);
  } catch (error) {
    console.error("Occurs an error while fetching details:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while fetching  details.",
    });
  }
};

const locationPATCH = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { location } = req.body;
    const me = await authModel.findById(userId, { userDetails: 1 });

    me.userDetails.location = location;

    me.save();

    res.status(200).json({
      status: 200,
      message: "You have successfully updated your location",
    });
  } catch (error) {
    console.error("Occurs an error while patching location:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while patching location.",
    });
  }
};

const jobPATCH = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { job } = req.body;
    const me = await authModel.findById(userId, { userDetails: 1 });

    me.userDetails.job = job;

    me.save();

    res.status(200).json({
      status: 200,
      message: "You have successfully updated your job",
    });
  } catch (error) {
    console.error("Occurs an error while patching job:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while patching job.",
    });
  }
};

const skillsPATCH = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { main, complementary, interest } = req.body;
    const me = await authModel.findById(userId, { userDetails: 1 });

    me.userDetails.mainSkills = main;
    me.userDetails.complementarySkills = complementary;
    me.userDetails.interests = interest;

    me.save();

    res.status(200).json({
      status: 200,
      message: "You have successfully updated your skills",
      me,
    });
  } catch (error) {
    console.error("Occurs an error while patching skills:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while patching skills.",
    });
  }
};

const experiencesPATCH = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      company,
      title,
      contractType,
      startDate,
      endDate,
      current,
      missions,
      itemId,
      edit,
      del,
    } = req.body;

    const obj = {
      company: company,
      title: title,
      contractType: contractType,
      startDate: startDate,
      endDate: endDate,
      current: current,
      missions: missions,
      itemId: itemId,
    };

    if (edit) {
      await authModel.updateOne(
        { _id: userId, "userDetails.experiences.itemId": itemId },
        { $set: { "userDetails.experiences.$": obj } }
      );
    } else if (del) {
      await authModel.updateOne(
        { _id: userId },
        { $pull: { "userDetails.experiences": { itemId: itemId } } }
      );
    } else {
      const me = await authModel.findById(userId, { userDetails: 1 });
      me.userDetails.experiences.push(obj);
      await me.save();
    }

    res.status(200).json({
      status: 200,
      message: "You have successfully updated your experiences",
    });
  } catch (error) {
    console.error("Occurs an error while patching experiences:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while patching experiences.",
    });
  }
};

const educationsPATCH = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      school,
      degree,
      startDate,
      endDate,
      current,
      description,
      itemId,
      edit,
      del
    } = req.body;

    const obj = {
      school: school,
      degree: degree,
      startDate: startDate,
      endDate: endDate,
      current: current,
      description: description,
      itemId: itemId,
    };

    if (edit) {
      await authModel.updateOne(
        { _id: userId, "userDetails.educations.itemId": itemId },
        { $set: { "userDetails.educations.$": obj } }
      );
    }  else if (del) {
      await authModel.updateOne(
        { _id: userId },
        { $pull: { "userDetails.educations": { itemId: itemId } } }
      );
    } else {
      const me = await authModel.findById(userId, { userDetails: 1 });
      me.userDetails.educations.push(obj);
      await me.save();
    }

    res.status(200).json({
      status: 200,
      message: "You have successfully updated your educations",
    });
  } catch (error) {
    console.error("Occurs an error while patching educations:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while patching educations.",
    });
  }
};

const languagesPATCH = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { language, level, itemId, edit, del } = req.body;

    const obj = {
      language: language,
      level: level,
      itemId: itemId,
    };

    if (edit) {
      await authModel.updateOne(
        { _id: userId, "userDetails.languages.itemId": itemId },
        { $set: { "userDetails.languages.$": obj } }
      );
    } else if (del) {
      await authModel.updateOne(
        { _id: userId },
        { $pull: { "userDetails.languages": { itemId: itemId } } }
      );
    } else {
      const me = await authModel.findById(userId, { userDetails: 1 });
      me.userDetails.languages.push(obj);
      await me.save();
    }

    res.status(200).json({
      status: 200,
      message: "You have successfully updated your languages",
    });
  } catch (error) {
    console.error("Occurs an error while patching languages:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while patching languages.",
    });
  }
};

const introPATCH = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { intro } = req.body;
    const me = await authModel.findById(userId, { userDetails: 1 });

    me.userDetails.intro = intro;

    me.save();

    res.status(200).json({
      status: 200,
      message: "You have successfully updated your intro",
    });
  } catch (error) {
    console.error("Occurs an error while patching intro:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while patching intro.",
    });
  }
};

module.exports = {
  detailsGET,
  locationPATCH,
  jobPATCH,
  skillsPATCH,
  experiencesPATCH,
  educationsPATCH,
  languagesPATCH,
  introPATCH,
};
