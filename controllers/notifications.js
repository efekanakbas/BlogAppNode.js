const { query } = require("express");
const notifModel = require("../models/notifications.js");
const { ObjectId } = require("mongodb");

const notifGET = async (req, res) => {
    try {
        const userId = req.user.userId;
        const query = req.query.from;
        
        // Belgeyi bul ve güncelle
        if(query === "notif") {
            await notifModel.updateMany(
                { "userTo._id": new ObjectId(userId) }, // Filtre
                { $set: { isShown: true } } // Güncelleme işlemi
            );
        }

        // Güncellenmiş tüm belgeleri bul
        const updatedNotifs = await notifModel.find({ "userTo._id": new ObjectId(userId) });

        // console.log("userId", userId);
        // console.log("updatedNotifs", updatedNotifs);
        console.log("query", query)

        res.status(200).json(updatedNotifs); // Güncellenmiş belgeleri yanıt olarak dön
    } catch (error) {
        console.error("Occurs an error while fetching notifications:", error);
        res.status(500).json({
            status: "Error",
            message: "Occurs an error while fetching notifications.",
        });
    }
}


module.exports = {notifGET}