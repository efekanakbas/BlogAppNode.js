const feedModel = require("../models/feed.js");
const authModel = require("../models/auth.js");

const feedGET = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;

    // Sayfalama işlemi yapar ve createAt alanına göre sıralar
    const allFeeds = await feedModel
      .find()
      .skip(startIndex)
      .limit(limit)
      .sort({ "feed.createAt": -1 }) // -1 büyükten küçüğe sıralar
      .lean();

    // __v ve _id alanlarını çıkarır ve istenen formata dönüştürür
    const formattedFeeds = allFeeds.map((feed) => {
      const { __v, _id, ...rest } = feed;

      const { feed: Ifeed, ...restWithoutFeed } = rest;
      const lastFeed = { ...Ifeed, feedId: _id };
      restWithoutFeed.feed = lastFeed;

      console.log("userId", userId)
      console.log("first",  restWithoutFeed.feed.likePerson)


      const isLiked = () => {
        return restWithoutFeed.feed.likePerson.some(
          (item) => item.userId.toString() === userId
        );
      };

      if (isLiked()) {
        restWithoutFeed.feed.liked = true;
      } else {
        restWithoutFeed.feed.liked = false;
      }

      return restWithoutFeed;
    });

    res.status(200).json(formattedFeeds);
  } catch (error) {
    console.error("Occurs an error while fetching feeds:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while fetching feeds.",
    });
  }
};

const feedPOST = async (req, res) => {
  try {
    const {
      text,
      liked,
      likeCount,
      commentsCount,
      comments,
      hashtags,
      mentions,
      location,
    } = req.body;
    // console.log("BODY", req.body)
    const images = req.body.images; // req.body.images üzerinden resimlerin URL'lerine erişin
    const userId = req.user.userId;

    const me = await authModel
      .findById(userId, { password: 0, __v: 0, userDetails: 0 })
      .lean();
    // _id alanını userId olarak yeniden adlandırır
    me.userId = me._id;
    delete me._id;

    const feed = {
      text: text,
      images: images,
      liked: liked,
      likeCount: likeCount,
      commentsCount: commentsCount,
      comments: comments,
      hashtags: hashtags,
      mentions: mentions,
      location: location,
    };

    const newFeed = (await feedModel.create({ user: me, feed })).toObject();

    // _id alanını feedId olarak feed nesnesinin içine verir
    const { __v, _id, ...rest } = newFeed;
    const { feed: Ifeed, ...restWithoutFeed } = rest;
    const lastFeed = { ...Ifeed, feedId: _id };
    restWithoutFeed.feed = lastFeed;

    res.status(201).json({
      post: restWithoutFeed,
    });
  } catch (error) {
    console.error("Occurs an error while creating a feed:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while creating a feed.",
    });
  }
};

const feedOneGET = async (req, res) => {
  try {
    const username = req.params.username;
    const userId = req.user.userId;
    // console.log("username", username)

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;

    // Sayfalama işlemi yapar ve createAt alanına göre sıralar
    const allFeeds = await feedModel
      .find({ "user.username": username })
      .skip(startIndex)
      .limit(limit)
      .sort({ "feed.createAt": -1 }) // -1 büyükten küçüğe sıralar
      .lean();

    // console.log("allFEEEDS", allFeeds)

    // __v ve _id alanlarını çıkarır ve istenen formata dönüştürür
    const formattedFeeds = allFeeds.map((feed) => {
      const { __v, _id, ...rest } = feed;

      const { feed: Ifeed, ...restWithoutFeed } = rest;
      const lastFeed = { ...Ifeed, feedId: _id };
      restWithoutFeed.feed = lastFeed;

      const isLiked = () => {
        return restWithoutFeed.feed.likePerson.some(
          (item) => item.userId.toString() === userId
        );
      };

      if (isLiked()) {
        restWithoutFeed.feed.liked = true;
      } else {
        restWithoutFeed.feed.liked = false;
      }

      return restWithoutFeed;
    });

    res.status(200).json(formattedFeeds);
  } catch (error) {
    console.error("Occurs an error while fetching feeds:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while fetching feeds.",
    });
  }
};

const likePOST = async (req, res) => {
  try {
    const { parentId, status  } = req.body;
    const userId = req.user.userId;

    const me = await authModel
      .findById(userId, { password: 0, __v: 0, userDetails: 0 })
      .lean();
    // _id alanını userId olarak yeniden adlandırır
    me.userId = me._id;
    delete me._id;

    const feed = await feedModel.findById(parentId);

    if(status === 1) {
      feed.feed.likeCount += 1;

      feed.feed.likePerson.push(me);
    } else {
      feed.feed.likeCount -= 1;

      feed.feed.likePerson = feed.feed.likePerson.filter((item) => item.userId.toString() !== userId)
    }

    feed.save();

    res.status(201).json(feed);
  } catch (error) {
    console.error("Occurs an error while posting like:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while posting like.",
    });
  }
};


module.exports = { feedGET, feedPOST, feedOneGET, likePOST };
