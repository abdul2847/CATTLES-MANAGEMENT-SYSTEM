const Manager = require("../models/managerModels");
const Owner = require("../models/ownerModel");

const isLoggedIn = async(req, res, next)=>{
  if (req.session && req.session.userId){
    next();
    if (req.path === "/") {
      return next();
    }
  
  }else{
    req.flash("alertMessage", "Please login to access page");
    req.flash("alertStatus", "danger");
    res.redirect('/login')
  }
}

// Middleware function to check if the user is a manager
const isManager = async(req, res, next) => {
    if (req.session.userId) {
      console.log(req.session.userId)
      let user = await Manager.findById(req.session.userId)  
        if (!user) {
          req.flash("alertMessage", "Please login as Manager ");
          req.flash("alertStatus", "danger");
          return res.redirect('/login');
        }else{
          next();
        }
    } else {
      req.flash("alertMessage", "please Login to access page");
      req.flash("alertStatus", "danger");
      return res.redirect('/login');
    }
};
  
const isAdmin = async (req, res, next) => {
    const alertMessage = "Please login as Administrator";
    const alertStatus = "danger";
  
    if (!req.session.userId) {
      req.flash("alertMessage", "Please login to access page");
      req.flash("alertStatus", alertStatus);
      return res.redirect('/login');
    }
  
    const user = await Manager.findById(req.session.userId);
  
    if (!user || user.isAdmin !== true) {
      req.flash("alertMessage", alertMessage);
      req.flash("alertStatus", alertStatus);
      return res.redirect('/login');
    }
  
    next();
};
  

  // Middleware function to check if the user is an owner
  const isOwner = async(req, res, next) => {
    if (req.session.userId) {
      console.log(req.session.userId)
      let user = await Owner.findById(req.session.userId)  
        if (!user) {
          req.flash("alertMessage", "Please login as Owner ");
          req.flash("alertStatus", "danger");
          return res.redirect('/login');
        }else{
          next();
        }
    } else {
      req.flash("alertMessage", "please Login to access page");
      req.flash("alertStatus", "danger");
      return res.redirect('/login');
    }
  };


  module.exports = {
    isManager,
    isOwner,
    isLoggedIn,
    isAdmin
  }