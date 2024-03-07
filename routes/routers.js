const express = require("express");
const Owner = require("../models/ownerModel");
const Manager = require("../models/managerModels");
const Guest = require("../models/guestModel");
const Cattle = require("../models/cattleModel");
const path = require('path')
const router = express.Router();
const bcrypt = require("bcrypt");
const multer = require('multer')
const {
  sendResetEmail,
  resetPassword,
  updateUserPassword,
  getUserProfile,
  sendEmail,
} = require("../utils/utilities");
const {isLoggedIn, isManager, isOwner} = require('../auth/auth')

const {capitalizeEachWord, generateCSV} = require('../utils/general_utils')



// Define storage options for uploaded files
const cattlestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Construct an absolute path to the destination folder
    const destinationPath = path.join(__dirname, "../public/uploads/cattles");
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    // Set the filename of the uploaded files
    cb(null, file.fieldname + "_" + Date.now() + "_" + path.extname(file.originalname));
  },
});

// Create a Multer instance with the storage options
const cattleupload = multer({ storage: cattlestorage });


router.get("/", (req, res)=>{
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");
  const alert = { message: alertMessage, status: alertStatus };
  try {
    const cattles = Cattle.find().populate('owner').sort()
    res.render('home', {isLoggedIn:req.session.userId, alert})
  } catch (error) {
    console.log(error.message);
  }
})

router.get('/cattles', isLoggedIn, async(req, res)=>{
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");
  const alert = { message: alertMessage, status: alertStatus };
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cattles = await Cattle.find()
      .populate("owner")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const totalCattle = await Cattle.countDocuments();
    const totalPages = Math.ceil(totalCattle / limit);

    res.render('cattles', {
      currentPage: page,
      totalPages,
      cattles,
      alert,
      isLoggedIn:req.session.userId,
    })
  } catch (error) {
    console.log(error)
  }
})

router.get("/contact_us", (req, res)=>{
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");
  const alert = { message: alertMessage, status: alertStatus };
  try {
    res.render('contact', {isLoggedIn:req.session.userId, alert})
  } catch (error) {
    console.log(error.message);
  }
})

router.get('/about_us', (req, res)=>{
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");
  const alert = { message: alertMessage, status: alertStatus };

  try {
    res.render('about', {isLoggedIn:req.session.userId, alert})
  } catch (error) {
    console.log(error)
  }
})
// Handle the POST request for sending feedback
router.post('/send_feedback', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    let reciepient; 
    reciepient = process.env.AUTH_EMAIL;
    await sendEmail(name, email, reciepient,subject, message);

    let feedbackmessage = `<div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; font-family: 'Arial', sans-serif; color: #333;">
    <p style="color: #555; font-size: 16px; line-height: 1.6;">Thank you for your feedback! We appreciate your time and value your input.</p>
    <p style="color: #555; font-size: 16px; line-height: 1.6;">Here is a summary of your message:</p>
    <blockquote style="border-left: 2px solid #007BFF; padding-left: 15px; color: #555; font-size: 16px; line-height: 1.6;">${message}</blockquote>
    <p style="color: #555; font-size: 16px; line-height: 1.6;">We will review your feedback and take appropriate action. If you have any further concerns, please feel free to reach out to us.</p>
    <p style="color: #555; font-size: 16px; line-height: 1.6;">Thank you for being a valued member of our community.</p>
    <p style="color: #555; font-size: 16px; line-height: 1.6;">Best regards,<br> Roddan Development Foundation</p>
    </div>`


    const Organization_email = process.env.AUTH_EMAIL;
    reciepient = email;
    await sendEmail(name, Organization_email,reciepient,'Thank you for your feedback', feedbackmessage);

    req.flash("alertMessage", "Message sent successfully. Please Wait for Reply");
    req.flash("alertStatus", "sucess");
    return res.redirect('/contact_us')

  } catch (error) {
    console.error('Error sending email:', error);
    req.flash("alertMessage", "Internal Server Error. Please check Connectivity");
    req.flash("alertStatus", "sucess");
    return res.redirect('/contact_us')
  }
});

router.get("/dashboard", isLoggedIn, async (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");
  const alert = { message: alertMessage, status: alertStatus };

  try {
    if (req.session.userId) {
      const user = await Owner.findById(req.session.userId); // Check if the user is an owner
      if (!user) {
        const manager = await Manager.findById(req.session.userId); // Check if the user is a manager
        if (manager) {
          const totalManager = await Manager.countDocuments();
          const totalOwners = await Owner.countDocuments();
          const totalCattles = await Cattle.countDocuments();
          const totalGuest = await Guest.countDocuments();
          return res.render("./manager/dashboard", { totalCattles, totalGuest, totalManager, totalOwners, isManager: true, alert });
        }
      } else {
        let userId = req.session.userId
        const totalManager = await Manager.countDocuments();
        const totalOwners = await Owner.countDocuments();
        const totalGuest = await Guest.countDocuments();
        const totalCattles = await Cattle.countDocuments({owner: userId});
        return res.render("./owner/dashboard", { totalCattles, totalGuest,totalManager, totalOwners, isOwner: true, alert });
      }
      res.redirect("/login"); // Redirect to login if the user type isn't recognized
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
    req.flash("alertMessage", "An error occurred. Please try again.");
    req.flash("alertStatus", "danger");
    res.redirect("/login");
  }
});

// Define a route handler for /track_cattles
router.get('/track_cattles', isLoggedIn,isManager, async (req, res) => {
  try {
   
    res.render('503'); // Replace this with your actual template or response
  } catch (error) {
    console.error("Error in cattle tracking:", error);
    // Handle errors or display an error page
    res.status(500).send("An error occurred while tracking cattles.");
  }
});
router.get("/user-profile", isLoggedIn,async (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");
  const alert = { message: alertMessage, status: alertStatus };
  try {

    await getUserProfile(req, res);
  } catch (error) {
    console.log(error);
  }
});

router.get("/signup", (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");
  const alert = { message: alertMessage, status: alertStatus };
  try {
    res.render("signup", { alert });
  } catch (error) {
    console.log(error);
  }
});

router.get("/login", (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");
  const alert = { message: alertMessage, status: alertStatus };
  try {
    res.render("login", { alert });
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  const { name, password, user_type,rememberMe } = req.body;

  try {
    if (!user_type) {
      req.flash("alertMessage", "Please select a user type.");
      req.flash("alertStatus", "danger");
      return res.redirect("/login");
    }

    let user;
    let userCollection;
    let capiterlizeName; 

    if (user_type === "manager") {
      userCollection = Manager;
    } else if (user_type === "owner") {
      userCollection = Owner;
    } else {
      const user = new Guest({
        visited: true,
        visitDate: Date.now(),
      });
      user.save();

      req.session.userId = user._id;
      req.session.isLoggedIn = true;

      return res.redirect("/");
    }

    if(name){
      capiterlizeName = capitalizeEachWord(name)
    }

     user = await userCollection.findOne({ name: capiterlizeName });

    if (!user) {
      req.flash("alertMessage", "Invalid username or password.");
      req.flash("alertStatus", "danger");
      return res.redirect("/login");
    }
    if(rememberMe){
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      req.flash("alertMessage", "Incorrect Password Entered.");
      req.flash("alertStatus", "danger");
      return res.redirect("/login");
    }
    // Store the user's ID in the session
    req.session.userId = user._id;
    req.session.isLoggedIn = true;

    if (user_type === "manager") {
      req.flash("alertMessage", "Login sucessfully welcome Back 🎉🎉🎉 ");
      req.flash("alertStatus", "sucess");
      res.redirect("/dashboard");
      req.session.isManager = true;
    } else if (user_type === "owner") {
      req.flash("alertMessage", "Login sucessfully welcome Back 🎉🎉🎉  ");
      req.flash("alertStatus", "sucess");
      res.redirect("/dashboard");
      req.session.isOwner = true;
    } else if (user_type === "guest") {
      res.redirect("/");
      req.session.userId = user._id;
      req.session.isLoggedIn = true;
    }else {
      req.flash("alertMessage", "Invalid user type.");
      req.flash("alertStatus", "danger");
      res.redirect("/login");
    }

  } catch (error) {
    console.error("An error occurred:", error.message);
    req.flash("alertMessage", "An error occurred. Please try again.");
    req.flash("alertStatus", "danger");
    res.redirect("/login");
  }
});

router.get('/logout', (req, res)=>{
  req.session.destroy();
  res.redirect('/login')
})
router.get("/forget_password", (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");
  const alert = { message: alertMessage, status: alertStatus };
  try {
    res.render("reset_password", { alert });
  } catch (error) {
    console.log(error);
  }
});

router.get("/verify_code", (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");
  const alert = { message: alertMessage, status: alertStatus };
  try {
    res.render("confirm_password", { alert });
  } catch (error) {
    console.log(error);
  }
});

router.get("/new_password", (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");
  const alert = { message: alertMessage, status: alertStatus };
  try {
    res.render("new_password", { alert });
  } catch (error) {
    console.log(error);
  }
});

// Route to send a verification code
router.post("/send_verification_code", async (req, res) => {
  const { email, user_type } = req.body; // Assuming you receive the email and user type in the request body
  try {
    let user;

    if (user_type === "manager") {
      user = await Manager.findOne({ email });
    } else if (user_type === "owner") {
      user = await Owner.findOne({ email });
    }

    if (!user) {
      req.flash("alertMessage", "User With Email not found");
      req.flash("alertStatus", "danger");
      return res.redirect("/forget_password");
    }
    // Use the sendResetEmail function to send the email
    await sendResetEmail(email, user, req, res);

    // Store the user's ID in the session
    req.session.userId = user._id;
    req.flash("alertMessage", "Verification Code Sent Successfully");
    req.flash("alertStatus", "success");
    return res.redirect("/verify_code");
  } catch (error) {
    throw error;
  }
});

router.post("/verify_Email", async (req, res) => {
  const { verify_code } = req.body;
  const userId = req.session.userId;

  try {
    await resetPassword(verify_code, userId, req, res);
  } catch (error) {
    console.log(error);
  }
});

router.post("/reset_password", async (req, res) => {
  const { password, confirm_password } = req.body;
  const userId = req.session.userId; // Use the key "userId" to retrieve the user's ID from the session

  try {
    if (password !== confirm_password) {
      // Handle the case where the passwords do not match
      req.flash("alertMessage", "Passwords do not match");
      req.flash("alertStatus", "danger");
      return res.redirect("/new_password");
    }

    // Call the function to update the user's password
    const updatedUser = await updateUserPassword(userId, password, req);

    // Optionally, you can use the updatedUser object for further actions or display success messages

    req.flash("alertMessage", "Password reset successful");
    req.flash("alertStatus", "success");
    return res.redirect("/login"); // Redirect to the login page or another appropriate page
  } catch (error) {
    console.log(error);
    req.flash("alertMessage", "An error occurred");
    req.flash("alertStatus", "danger");
    return res.redirect("/new_password");
  }
});

// Route to handle the cattle form submission
router.post("/add_cattle", cattleupload.single("images"), async (req, res) => {
  try {
    // Extract data from the form submission
    const {
      ownername,
      breed,
      age,
      gender,
      dateOfBirth,
      color,
      weight,
      healthStatus,
      vaccinationName,
      vaccinationDate,
      isPregnant,
      pregnancies,
      lastCalvingDate,
      notes,
    } = req.body;

    const cattleowner = capitalizeEachWord(ownername)
    const owner = await Owner.findOne({ name: cattleowner });

    const existingCattleCount = await Cattles.countDocuments({ owner: owner._id });
    const uniqueNumber = (existingCattleCount + 1).toString().padStart(3, '0');
    
    let identificationNumber = owner.uniqueCode;

    if (owner) {
      // Create a new Cattle instance
      const newCattle = new Cattles({
        owner: owner._id,
        breed: breed,
        age: age,
        gender: gender,
        dateOfBirth: dateOfBirth,
        color: color,
        weight: weight,
        identificationNumber: `${identificationNumber}${uniqueNumber}`,
        healthStatus: healthStatus,
        vaccinations: vaccinationName, // Assuming vaccinations is a JSON string
        vaccinationDate:vaccinationDate,
        reproductionHistory: {
          isPregnant: isPregnant === "true", 
          pregnancies: pregnancies,
          lastCalvingDate: lastCalvingDate,
        },
        images: req.file ? req.file.filename : null,
        notes: notes,
      });

      // Save the new cattle to the database
      await newCattle.save();

       owner.cattles.push(newCattle._id);

      await owner.save();

      req.flash("alertMessage", "Cattle added sucessfully");
      req.flash("alertStatus", "sucess");
      res.redirect("/manager/add_cattle");
    }
    else{
      req.flash("alertMessage", "Owner with not found");
      req.flash("alertStatus", "danger");
      res.redirect("/manager/add_cattle");
    }
  }  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Create the POST route for saving manager details
router.post("/add/owner",  async (req, res) => {
  const { name, location, email, phone, gender, house_Address,password } = req.body;
  try {
    const capiterlizeName = capitalizeEachWord(name);
    const userTag = generateUserCode(capiterlizeName);

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Manager instance with data from the request body
    const owner = new Owner({
      name: capiterlizeName,
      uniqueCode: userTag,
      location: location,
      House_No:house_Address,
      email: email,
      phone: phone,
      gender: gender,
      image: req.file ? req.file.filename : null, // Save the uploaded image filename
      password: hashedPassword, // Save the hashed password
    });

    // Save the manager to the database
    await owner.save();

    console.log(owner);
    req.flash("alertMessage", "Account Created sucessfully");
    req.flash("alertStatus", "sucess");
    res.redirect("/dashboard");

  } catch (error) {
    req.flash("alertMessage", "Error occured in Creating Account");
    req.flash("alertStatus", "danger");
    res.redirect("/dashboard");
  }
});


// Handle the search request

module.exports = router;
