const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  generateUserCode,
  generateStaffId,
  capitalizeEachWord,
  generateCSVData,
  generateAndDownloadPDF
} = require("../utils/general_utils");
const { isLoggedIn, isManager, isOwner } = require("../auth/auth");
const path = require("path");
const bcrypt = require("bcrypt");
const Manager = require("../models/managerModels");
const Owner = require("../models/ownerModel");
const Cattles = require("../models/cattleModel");
const json2csv = require('json2csv');


// Define storage options for uploaded files
const userstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Construct an absolute path to the destination folder
    const destinationPath = path.join(__dirname, "../public/uploads/users");
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    // Set the filename of the uploaded files
    cb(
      null,
      file.fieldname + "_" + Date.now() + "_" + path.extname(file.originalname)
    );
  },
});
// Create a Multer instance with the storage options
const userupload = multer({ storage: userstorage });

const cattlestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Construct an absolute path to the destination folder
    const destinationPath = path.join(__dirname, "../public/uploads/cattles");
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    // Set the filename of the uploaded files
    cb(
      null,
      file.fieldname + "_" + Date.now() + "_" + path.extname(file.originalname)
    );
  },
});

// Create a Multer instance with the storage options
const cattleupload = multer({ storage: cattlestorage });



router.get("/manager/cattles", isLoggedIn, async (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");

  const alert = { message: alertMessage, status: alertStatus };
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cattles = await Cattles.find()
      .populate("owner")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const totalCattle = await Cattles.countDocuments();
    const totalPages = Math.ceil(totalCattle / limit);

    res.render("./manager/cattles", {
      currentPage: page,
      totalPages,
      cattles,
      alert,
    });
  } catch (error) {
    res.status(500).send("Error fetching cattles: " + error.message);
  }
});

router.get("/manager/edit", isLoggedIn, isManager, async (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");

  const alert = { message: alertMessage, status: alertStatus };
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const owners = await Owner.find().sort({ _id: -1 }).skip(skip).limit(limit);
    const totalOwners = await Owner.countDocuments();
    const totalPages = Math.ceil(totalOwners / limit);

    res.render("./manager/editPage", {
      currentPage: page,
      totalPages,
      owners,
      alert,
    });
  } catch (error) {
    res.status(404);
  }
});


router.get("/manager/managers/edit", isLoggedIn, isManager, async (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");

  const alert = { message: alertMessage, status: alertStatus };
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const managers = await Manager.find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
    const totalManagers = await Manager.countDocuments();
    const totalPages = Math.ceil(totalManagers / limit);

    res.render("./manager/managerEdit", {
      currentPage: page,
      totalPages,
      managers,
      alert,
    });
  } catch (error) {
    res.status(404);
  }
});
router.get("/manager/managers", isLoggedIn, isManager, async (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");

  const alert = { message: alertMessage, status: alertStatus };
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const managers = await Manager.find().sort({ _id: -1 }).skip(skip).limit(limit);
    const totalManagers = await Manager.countDocuments();
    const totalPages = Math.ceil(totalManagers / limit);

    res.render("./manager/manager",{
      currentPage: page,
      totalPages,
      managers,
      alert,
    });
  } catch (error) {
    res.status(404)
  }

});
router.get("/manager/add_manager",   (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");

  const alert = { message: alertMessage, status: alertStatus };
  try {
    res.render("./manager/add_manager", { alert });
  } catch (error) {}
});
router.get("/manager/owners", isLoggedIn, isManager, async (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");

  const alert = { message: alertMessage, status: alertStatus };
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const owners = await Owner.find().sort({ _id: -1 }).skip(skip).limit(limit);
    const totalOwners = await Owner.countDocuments();
    const totalPages = Math.ceil(totalOwners / limit);

    res.render("./manager/owners", {
      currentPage: page,
      totalPages,
      owners,
      alert,
    });
  } catch (error) {
    // Handle errors appropriately, for instance, rendering an error page or sending an error response
    res.status(500).send("Error fetching owners: " + error.message);
  }
});
router.get('/manager/update/owner/:ownerId', isLoggedIn, isManager, async(req, res)=>{
  const ownerId = req.params.ownerId

  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");

  const alert = { message: alertMessage, status: alertStatus };

  try {

    const owner = await Owner.findById(ownerId)

    if(!owner){
      req.flash("alertMessage", "Manager Not Found");
      req.flash("alertStatus", "danger");
      return res.redirect("/manager/edit");
    }
    res.render('./manager/updateOwner', {alert, owner})
  } catch (error) {
    req.flash("alertMessage", `${error.message}`);
    req.flash("alertStatus", "danger");
    console.log(error)
    return res.redirect("/manager/edit")
  }
})

router.post('/manager/update/owner/:ownerId', isLoggedIn, isManager, userupload.single("image"),async(req, res)=>{
    const ownerId = req.params.ownerId;
    const { name, location, email, phone, gender, house_Address,password } = req.body;
    try {
        const existingOwner = await Owner.findById(ownerId)

    if (!existingOwner) {
      req.flash("alertMessage", "Manager not found");
      req.flash("alertStatus", "danger");
      return res.redirect(`/manager/update/manager/${ownerId}`);
    }
    if(name){
      const capiterlizeName = capitalizeEachWord(name);
      const userTag = generateUserCode(capiterlizeName);

      existingOwner.uniqueCode = userTag;
    }
    // Update manager details
    existingOwner.name = capitalizeEachWord(name);
    existingOwner.location = location;
    existingOwner.House_No = house_Address;
    existingOwner.email = email;
    existingOwner.phone = phone;
    existingOwner.gender = gender;

    // If a new password is provided, hash and update it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingOwner.password = hashedPassword;
    }

    // If a new image is uploaded, update the image filename
    if (req.file) {
      existingOwner.image = req.file.filename;
    }

    // Save the updated manager to the database
    await existingOwner.save();

    req.flash("alertMessage", "Owner details updated sucessfully");
    req.flash("alertStatus", "sucess");
    res.redirect(`/manager/update/owner/${ownerId}`);

    } catch (error) {
      console.log(error);
      req.flash("alertMessage", "Error Occured in Creating Account");
      req.flash("alertStatus", "danger");
      res.redirect(`/manager/update/owner/${ownerId}`);
    }
})

router.get('/manager/delete/owner/:ownerId', isLoggedIn, isManager,  async (req, res) => {
  try {
      const ownerId = req.params.ownerId;

      // Find the owner and populate the cattles field
      const owner = await Owner.findById(ownerId).populate('cattles');

      if (!owner) {
        req.flash("alertMessage", "User Not Found with this ID");
        req.flash("alertStatus", "danger");
        return res.redirect('/manager/edit')
      }

      // Check if the owner has cattle
      if (owner.cattles.length > 0) {
          req.flash("alertMessage", "Cannot delete owner with cattle. Please delete the cattle first.");
          req.flash("alertStatus", "danger");
          return res.redirect('/manager/edit')
      }

      // Delete the owner if no cattle found
      await Owner.findByIdAndDelete(ownerId);

      res.redirect('/manager/edit'); // Redirect to the owners' page after deletion
  } catch (error) {
      console.error(error);
      req.flash("alertMessage", "Internal Server Error");
      req.flash("alertStatus", "danger");
      return res.redirect('/manager/edit')
  }
});

router.get(
  "/manager/view/owners/:userId",
  isLoggedIn,
  isManager,
  async (req, res) => {
    const userId = req.params.userId; // Extract the userId from params

    try {
      const limit = 6; // Number of latest owners to display
      const latestOwners = await Owner.find()
        .sort({ createdAt: -1 }) // Sort by creation date in descending order (latest first)
        .limit(limit); // Limit the results to the specified number
      const owner = await Owner.findById(userId);
      const ownerCattles = await Cattles.find({owner:userId}).populate('owner').sort({ createdAt: -1 })

      if (!owner) {
        req.flash("alertMessage", "User Not Found with this ID");
        req.flash("alertStatus", "danger");
        return res.redirect("/manager/owners");
      }

      console.log(owner);
      return res.render("./manager/owner_details", { owner, latestOwners, ownerCattles });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      return res.redirect("/manager/owners");
    }
  }
);



router.get("/manager/add_owner", isLoggedIn, isManager, (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");

  const alert = { message: alertMessage, status: alertStatus };
  try {
    res.render("./manager/add_owner", { alert });
  } catch (error) {
    res.status(404).send("an error occur", error.message);
  }
});


// Create the POST route for saving owner
router.post(
  "/manager/add/owner",
  userupload.single("image"),
  async (req, res) => {
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
      res.redirect("/manager/add_owner");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", "Error Occured in Creating Account");
      req.flash("alertStatus", "danger");
      res.redirect("/manager/add_owner");
    }
  }
);

// Create the POST route for saving manager details
router.post("/manager/add/manager", userupload.single("image"), async (req, res) => {
  const { name, location, email, phone, gender, password, house_Address } = req.body;
  try {

    let managerExist = Manager.findOne({email: email});
    
    if(managerExist){
      req.flash("alertMessage", "Manager with Email  and phone Already Exist");
      req.flash("alertStatus", "danger");
      res.redirect("/manager/add_manager");
    }

    // Generate staffId and password
    const staffId = generateStaffId();


    const managername = capitalizeEachWord(name)
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Manager instance with data from the request body
    const manager = new Manager({
      name: managername,
      staffId: staffId,
      location: location,
      house_Address: house_Address,
      email: email,
      phone: phone,
      gender: gender,
      image: req.file ? req.file.filename : null, // Save the uploaded image filename
      password: hashedPassword, // Save the hashed password
    });

    // Save the manager to the database
    await manager.save();
    console.log(manager)
    req.flash("alertMessage", "Account Created sucessfully");
    req.flash("alertStatus", "sucess");

    res.redirect("/manager/add_manager");
  } catch (error) {
    req.flash("alertMessage", "An error Occured");
    req.flash("alertStatus", "danger");
    console.log(error)
    res.redirect("/manager/add_manager");
  }
});

router.get(
  "/manager/view/manager/:managerId",
  isLoggedIn,
  isManager,
  async (req, res) => {
    const managerId = req.params.managerId; // Extract the userId from params

    try {
      const limit = 6; // Number of latest owners to display
      const latestManagers = await Manager.find()
        .sort({ createdAt: -1 }) // Sort by creation date in descending order (latest first)
        .limit(limit); // Limit the results to the specified number
      const manager = await Manager.findById(managerId);

      if (!manager) {
        req.flash("alertMessage", "User Not Found with this ID");
        req.flash("alertStatus", "danger");
        return res.redirect("/manager/managers");
      }

      console.log(manager);
      return res.render("./manager/manager_details", { manager, latestManagers });
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      return res.redirect("/manager/managers");
    }
  }
);

router.get('/manager/update/manager/:managerId', async(req, res)=>{
  const managerId = req.params.managerId

  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");

  const alert = { message: alertMessage, status: alertStatus };

  try {
    console.log(managerId)

    const manager = await Manager.findById(managerId)

    if(!manager){
      req.flash("alertMessage", "Manager Not Found");
      req.flash("alertStatus", "danger");
      return res.redirect("/manager/managers");
    }
    console.log(manager.name)
    res.render('./manager/updateManager', {alert, manager})
  } catch (error) {
    req.flash("alertMessage", `${error.message}`);
    req.flash("alertStatus", "danger");
    console.log(error)
    return res.redirect("/manager/managers")
  }
})
// Update manager details by ID
router.post("/manager/update/manager/:managerId", userupload.single("image"), async (req, res) => {
  const managerId = req.params.managerId;
  const { name, location, email, phone, gender, password, house_Address } = req.body;

  try {
    // Check if manager with given ID exists
    const existingManager = await Manager.findById(managerId);
    
    if (!existingManager) {
      req.flash("alertMessage", "Manager not found");
      req.flash("alertStatus", "danger");
      return res.redirect(`/manager/update/manager/${managerId}`);
    }

    // Update manager details
    existingManager.name = capitalizeEachWord(name);
    existingManager.location = location;
    existingManager.house_Address = house_Address;
    existingManager.email = email;
    existingManager.phone = phone;
    existingManager.gender = gender;

    // If a new password is provided, hash and update it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingManager.password = hashedPassword;
    }

    // If a new image is uploaded, update the image filename
    if (req.file) {
      existingManager.image = req.file.filename;
    }

    // Save the updated manager to the database
    await existingManager.save();

    req.flash("alertMessage", "Manager details updated sucessfully");
    req.flash("alertStatus", "sucess");
    res.redirect(`/manager/update/manager/${managerId}`);
  } catch (error) {
    console.error("Error:", error);
    req.flash("alertMessage", "An error occurred while updating manager details");
    req.flash("alertStatus", "danger");
    res.redirect(`/manager/update/manager/${managerId}`);
  }
  
});

// Delete manager by ID
router.get("/manager/delete/manager/:managerId", async (req, res) => {
  const managerId = req.params.managerId;

  try {
    // Check if manager with given ID exists
    const existingManager = await Manager.findByIdAndDelete(managerId);

    if (!existingManager) {
      req.flash("alertMessage", "Manager not found");
      req.flash("alertStatus", "danger");
      return res.redirect("/manager/managers/edit");
    }

    req.flash("alertMessage", "Manager deleted sucessfully");
    req.flash("alertStatus", "sucess");
    res.redirect("/manager/managers/edit");
  } catch (error) {
    req.flash("alertMessage", "An error occurred while deleting manager");
    req.flash("alertStatus", "danger");
    console.error(error);
    res.redirect("/manager/managers/edit");
  }
});


// Router to handle the cattles Routers
router.get("/manager/add_cattle", isLoggedIn, isManager, (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");

  const alert = { message: alertMessage, status: alertStatus };
  try {
    res.render("./manager/add_cattle", { alert });
  } catch (error) {
    res.status(404);
  }
});

router.get("/manager/cattle/edit", isLoggedIn, isManager, async (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");

  const alert = { message: alertMessage, status: alertStatus };
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cattles = await Cattles.find()
      .populate("owner")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
    const totalCattles = await Cattles.countDocuments();
    const totalPages = Math.ceil(totalCattles / limit);

    res.render("./manager/cattleEdit", {
      currentPage: page,
      totalPages,
      cattles,
      alert,
    });
  } catch (error) {
    res.status(404);
  }
});

router.post(
  "/manager/add_cattle",
  cattleupload.single("images"),
  async (req, res) => {
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
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `Error Occured in Creating Account ${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/manager/add_cattle");
    }
  }
);

router.get('/manager/update/cattle/:cattleId',  isLoggedIn, isManager, async(req, res)=>{
  const cattleId = req.params.cattleId; // Extract the userId from params
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");

  const alert = { message: alertMessage, status: alertStatus };
  try {
  
    const cattle = await Cattles.findById(cattleId).populate('owner');

    if (!cattle) {
      req.flash("alertMessage", "User Not Found with this ID");
      req.flash("alertStatus", "danger");
      return res.redirect("/manager/cattles");
    } 
    return res.render("./manager/updateCattle", { cattle, alert });
  } catch (error) {
    req.flash("alertMessage", `${error.message}`);
    req.flash("alertStatus", "danger");
    console.log(error)
    return res.redirect("/manager/cattles");
  }

});

router.post('/manager/update/cattle/:cattleId',cattleupload.single("images"), isLoggedIn, isManager, async (req, res) => {
  const cattleId = req.params.cattleId;
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


  try {
    // Find the cattle by ID
    const cattle = await Cattles.findById(cattleId);

    if (!cattle) {
      return res.status(404).json({ error: 'Cattle not found' });
    }

    // Update cattle properties
    cattle.ownername = ownername;
    cattle.breed = breed;
    cattle.age = age;
    cattle.gender = gender;
    cattle.dateOfBirth = dateOfBirth;
    cattle.color = color;
    cattle.weight = weight;
    cattle.healthStatus = healthStatus;
    cattle.vaccinations = vaccinationName;           
    cattle.vaccinationDate = vaccinationDate;
    cattle.reproductionHistory.isPregnant = isPregnant === "true";
    cattle.reproductionHistory.pregnancies = pregnancies;
    cattle.reproductionHistory.lastCalvingDate = lastCalvingDate;
    cattle.notes = notes;

    // Save the updated cattle
    await cattle.save();
    req.flash("alertMessage", "Cattle Updated sucessfully");
    req.flash("alertStatus", "sucess");
    res.redirect(`/manager/update/cattle/${cattleId}`)
  } catch (error) {
    req.flash("alertMessage", `Error occured updating cattle ${error.message}`);
    req.flash("alertStatus", "danger");
    res.redirect(`/manager/update/cattle/${cattleId}`)
  }
});
router.get('/manager/view/cattle/:cattleId',  isLoggedIn, isManager, async(req, res)=>{
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
      const ownerId = cattle.owner._id;

    const ownercattles = await Cattles.find({owner: ownerId}).populate('owner').sort({ _id: -1 })
    
    return res.render("./manager/cattle_details", { cattle, latestCattles, ownercattles });
  } catch (error) {
    req.flash("alertMessage", `${error.message}`);
    req.flash("alertStatus", "danger");
    return res.redirect("/manager/cattles");
  }

});
router.get('/manager/delete/cattle/:cattleId', async (req, res)=>{
  const cattleId = req.params.cattleId;

  try {
     const cattle = await Cattles.findByIdAndDelete(cattleId)

    if(!cattle){
      req.flash("alertMessage", "cattle Not Found with this ID");
      req.flash("alertStatus", "danger");
      return res.redirect("/manager/cattle/edit");
    }

      req.flash("alertMessage", "Cattle Deleted Sucessfully");
      req.flash("alertStatus", "sucess");
      res.redirect("/manager/cattle/edit");
  } catch (error) {
    req.flash("alertMessage", `Cattle fail to delete ${error.message}` );
    req.flash("alertStatus", "danger");
    return res.redirect("/manager/cattle/edit");
  }
})


router.get("/manager/user/profile", isLoggedIn, isManager, async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      req.flash("alertMessage", "User not logged in");
      req.flash("alertStatus", "danger");
      return res.redirect("/login");
    }

    try {
      let manager = await Manager.findById(userId);

      if (!manager) {
        req.flash("alertMessage", "User not found");
        req.flash("alertStatus", "danger");
        return res.redirect("/login");
      }

      return res.render("./manager/profile", { manager });
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

router.get('/download_records', async (req, res) => {
  try {
    // Fetch data (replace this with your actual data-fetching logic)
  const data = await Owner.find().populate('cattles');

         // Set response headers for attachment
         res.setHeader('Content-Type', 'application/pdf');
         res.setHeader('Content-Disposition', 'attachment; filename=records.pdf');
 
         // Generate and download PDF
         generateAndDownloadPDF(data, res);

        // console.log(data)
    // Generate and download PDF
    // generateAndDownloadPDF(data, res);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/search', isLoggedIn, async (req, res) => {
  const alertMessage = req.flash("alertMessage");
  const alertStatus = req.flash("alertStatus");

  const alert = { message: alertMessage, status: alertStatus };

  try {
    const query = req.query.query; 

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const owners = await Owner
      .find({ name: { $regex: query, $options: 'i' } })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const totalOwners = await Owner.countDocuments();
    const totalPages = Math.ceil(totalOwners / limit);




    res.render('./manager/search_results', { owners,  alert, query ,  currentPage: page,
      totalPages,});
  } catch (error) {
    req.flash('alertMessage', 'Error searching for products');
    req.flash('alertStatus', 'danger');
    res.redirect('/dashboard');

    // Handle the error appropriately
  }
});


module.exports = router;
