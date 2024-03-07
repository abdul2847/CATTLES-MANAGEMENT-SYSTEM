const express = require("express");
const router = express.Router();
const Owner = require("../models/ownerModel");
const Cattles = require('../models/cattleModel')
const Guest = require("../models/guestModel");
const {isLoggedIn, isManager, isOwner} = require('../auth/auth')
const {  capitalizeEachWord,
} = require("../utils/general_utils");

router.get("/owner/user/profile", isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      req.flash("alertMessage", "User not logged in");
      req.flash("alertStatus", "danger");
      return res.redirect("/login");
    }

    try {
      let owner = await Owner.findById(userId);

      if (!owner) {
        req.flash("alertMessage", "User not found");
        req.flash("alertStatus", "danger");
        return res.redirect("/login");
      }

      return res.render("./owner/profile", { owner });
    } catch (error) {
      console.error("An error occurred:", error.message);
      req.flash("alertMessage", "An error occurred. Please try again.");
      req.flash("alertStatus", "danger");
      return res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/owner/cattles", isLoggedIn,async (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");

  const alert = { message: alertMessage, status: alertStatus };
  try {
    const ownerId = req.session.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cattles = await Cattles.find({owner: ownerId}).populate('owner').sort({ _id: -1 }).skip(skip).limit(limit);
    
    const totalCattle = await Cattles.countDocuments();
    const totalPages = Math.ceil(totalCattle / limit);

    res.render("./owner/cattles", { currentPage: page, totalPages, cattles, alert});  
  } catch (error) {
    res.status(500).send("Error fetching cattles: " + error.message);
  }
});
router.get('/manager/view/cattle/:cattleId',  isLoggedIn, async(req, res)=>{
  const cattleId = req.params.cattleId; // Extract the userId from params

  try {
    const limit = 6; // Number of latest owners to display
    const latestCattles = await Cattles.find().populate('owner')
      .sort({ createdAt: -1 }) // Sort by creation date in descending order (latest first)
      .limit(limit); // Limit the results to the specified number
    const cattle = await Cattles.findById(cattleId).populate('owner');

    if (!cattle) {
      req.flash("alertMessage", "User Not Found with this ID");
      req.flash("alertStatus", "danger");
      return res.redirect("/manager/cattles");
    } 
    return res.render("./manager/cattle_details", { cattle, latestCattles });
  } catch (error) {
    req.flash("alertMessage", `${error.message}`);
    req.flash("alertStatus", "danger");
    return res.redirect("/manager/cattles");
  }

});

router.get("/owners", (req, res) => {
  res.render("./owner/owners");
});
router.get("/add_owner", (req, res) => {
  res.render("./owner/add_owner");
});


module.exports = router;
