const feedModel = require("../models/feed.js");
const authModel = require("../models/auth.js");

const feedGET = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;


    const me = await authModel.findById(userId , {"__v":0  })

    const blockedUsernames = me.userDetails.blocked.map(blockedUser => blockedUser.username);

    // Sayfalama işlemi yapar ve createAt alanına göre sıralar
    const allFeeds = await feedModel
      .find({ "user.username": { $nin: blockedUsernames } })
      .skip(startIndex)
      .limit(limit)
      .sort({ "feed.createAt": -1 }) // -1 büyükten küçüğe sıralar
      .lean();

      // console.log("allFeeds", allFeeds)

    // __v ve _id alanlarını çıkarır ve istenen formata dönüştürür
    const formattedFeeds = allFeeds.map((feed) => {
      const { __v, _id, ...rest } = feed;

      const { feed: Ifeed, ...restWithoutFeed } = rest;
      const lastFeed = { ...Ifeed, feedId: _id };
      restWithoutFeed.feed = lastFeed;

      // comments içindeki _id'yi commentId olarak comment içine yerleştirir
      restWithoutFeed.feed.comments.map((item) => {
        const { _id: mongoId, ...rest } = item;
        rest.comment.commentId = mongoId.toString();
        rest.comment.parentId = _id.toString();
        delete item._id;
      });

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

      const isFollowed = () => {
        return restWithoutFeed.user.userDetails.followers.some(
          (item) => item._id.toString() === userId
        );
      };

      if (isFollowed()) {
        restWithoutFeed.user.followed = true;
      } else {
        restWithoutFeed.user.followed = false;
      }

      // feed yorunlarının beğenme durumunu kontrol eder
      restWithoutFeed.feed.comments.map((item) => {
        const isLiked = () => {
          return item.comment.likePerson.some(
            (item) => item.userId.toString() === userId
          );
        };

        if (isLiked()) {
          item.comment.liked = true;
        } else {
          item.comment.liked = false;
        }
        return restWithoutFeed;
      });

      // console.log("restWithoutFeed", restWithoutFeed)

      // feed yorunlarını atanın takip edilme durumunu kontrol eder
      restWithoutFeed.feed.comments.map((item) => {
        // console.log("item", item)
        const isFollowed = () => {
          return item.user.userDetails.followers.some(
            (item) => item._id.toString() === userId
          );
        };

        if (isFollowed()) {
          item.user.followed = true;
        } else {
          item.user.followed = false;
        }
        return restWithoutFeed;
      });

      restWithoutFeed.feed.comments = restWithoutFeed.feed.comments.reverse();
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

    const me = await authModel.findById(userId, { password: 0, __v: 0 }).lean();
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

      // comments içindeki _id'yi commentId olarak comment içine yerleştirir
      restWithoutFeed.feed.comments.map((item) => {
        const { _id: mongoId, ...rest } = item;
        rest.comment.commentId = mongoId.toString();
        rest.comment.parentId = _id.toString();
        delete item._id;
      });

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

      const isFollowed = () => {
        return restWithoutFeed.user.userDetails.followers.some(
          (item) => item._id.toString() === userId
        );
      };

      if (isFollowed()) {
        restWithoutFeed.user.followed = true;
      } else {
        restWithoutFeed.user.followed = false;
      }

      // feed yorunlarının beğenme durumunu kontrol eder
      restWithoutFeed.feed.comments.map((item) => {
        const isLiked = () => {
          return item.comment.likePerson.some(
            (item) => item.userId.toString() === userId
          );
        };

        if (isLiked()) {
          item.comment.liked = true;
        } else {
          item.comment.liked = false;
        }
        return restWithoutFeed;
      });

       // feed yorunlarını atanın takip edilme durumunu kontrol eder
       restWithoutFeed.feed.comments.map((item) => {
        // console.log("item", item)
        const isFollowed = () => {
          return item.user.userDetails.followers.some(
            (item) => item._id.toString() === userId
          );
        };

        if (isFollowed()) {
          item.user.followed = true;
        } else {
          item.user.followed = false;
        }
        return restWithoutFeed;
      });

      restWithoutFeed.feed.comments = restWithoutFeed.feed.comments.reverse();
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
    const { parentId, status, type, commentId } = req.body;
    const userId = req.user.userId;

    const me = await authModel
      .findById(userId, { password: 0, __v: 0, userDetails: 0 })
      .lean();
    // _id alanını userId olarak yeniden adlandırır
    me.userId = me._id;
    delete me._id;

    const feed = await feedModel.findById(parentId);

    if (type === "feed") {
      if (status === 1) {
        feed.feed.likeCount += 1;

        feed.feed.likePerson.push(me);
      } else {
        feed.feed.likeCount -= 1;

        feed.feed.likePerson = feed.feed.likePerson.filter(
          (item) => item.userId.toString() !== userId
        );
      }
    } else {
      const selectedComment = feed.feed.comments.find(
        (item) => item._id.toString() === commentId
      );

      console.log("selectedComment", selectedComment);

      if (status === 1) {
        selectedComment.comment.likesCount += 1;

        selectedComment.comment.likePerson.push(me);
      } else {
        selectedComment.comment.likesCount -= 1;

        selectedComment.comment.likePerson = feed.feed.likePerson.filter(
          (item) => item.userId.toString() !== userId
        );
      }
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

const commentPOST = async (req, res) => {
  try {
    const { parentId, text } = req.body;
    const userId = req.user.userId;

    const me = await authModel
      .findById(userId, { password: 0, __v: 0, isLogged: 0 })
      .lean();
    // _id alanını userId olarak yeniden adlandırır
    me.userId = me._id;
    delete me._id;

    const feed = await feedModel.findById(parentId);

    const comment = {
      user: me,
      comment: {
        text: text,
      },
    };

    feed.feed.comments.push(comment);

    feed.feed.commentsCount += 1;

    feed.save();

    // console.log("feed", feed)
    const formattedComment = feed.feed.comments.map((item) => {
      // console.log("item", item);
      const { _id: mongoId, ...rest } = item.toObject();
      console.log("rest", rest);
      rest.comment.commentId = mongoId.toString();

      return rest;
    });

    res.status(201).json(formattedComment);
  } catch (error) {
    console.error("Occurs an error while posting comment:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while posting comment.",
    });
  }
};

const feedDELETE = async (req, res) => {
  try {
    const { parentId, type, commentId } = req.body;

    if (type === "feed") {
      await feedModel.findByIdAndDelete(parentId);
    } else {
      const feed = await feedModel.findById(parentId);
      feed.feed.commentsCount -= 1
      feed.feed.comments = feed.feed.comments.filter(
        (item) => item._id.toString() !== commentId
      );
      await feed.save();
    }

    res.status(200).json({
      message: "You have deleted successfully",
    });
  } catch (error) {
    console.error("Occurs an error while deleting:", error);
    res.status(500).json({
      status: "Error",
      message: "Occurs an error while deleting.",
    });
  }
};

module.exports = {
  feedGET,
  feedPOST,
  feedOneGET,
  likePOST,
  commentPOST,
  feedDELETE,
};
