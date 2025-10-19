const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash')
const bcrypt = require('bcrypt');
const authorize = require("../middleware/authorize");
const auth = require("../middleware/auth");

// router.post('/', async(req, res) => {
// const { error } = validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
    
// let user = await User.findOne({ email: req.body.email, phoneNumber: req.body.phoneNumber });
//     if (user) return res.status(400).send('User already registered.');
    
//     user = new User({
//         name: req.body.name,
//         email: req.body.email,
//         phoneNumber: req.body.phoneNumber,
//         password: req.body.password
//     });
//     const salt = await bcrybt.genSalt(10);
//     user.password = await bcrybt.hash(user.password, salt);
    
    
    
//         await user.save();
//     res.send(_.pick(user, ['_id', 'name', 'email', 'phoneNumber']));
// })


     

// module.exports = router
router.get('/', async (req, res) => {
  const user = await User.find().sort('name')
  res.send(user)
});

router.post("/", async (req, res) => {
  try {
    // Joi validation
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // Check if user already exists
    let user = await User.findOne({
      $or: [
        { email: req.body.email },
        { phoneNumber: req.body.phoneNumber }
      ]
    });
    if (user) {
      return res.status(400).json({ error: "User already registered." });
    }
    // Create new user
    user = new User({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
    });
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    // Save user
    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).status(201).json({
      message: "User registered successfully",
      user: _.pick(user, ["_id", "name", "email", "phoneNumber"]),
    });
    // Success response (JSON only)
    // res.status(201).json({
    //   message: "User registered successfully",
    //   user: _.pick(user, ["_id", "name", "email", "phoneNumber"]),
    // });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.post("/create-distributor", async (req, res) => {
  
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//    const location = await Location.findById(req.body.locationId)
//   if (!location) return res.status(404).send('invalid location id');

//   let user = await User.findOne({ email: req.body.email });
//   if (user) return res.status(400).send("User already registered.");
//   user = new User({
//     name: req.body.name,
//     email: req.body.email,
//     phoneNumber: req.body.phoneNumber,
//     password: req.body.password,
//     location: {
//             country: req.body.country,
//             state: req.body.state,
//             city: req.body.city
//         },
//     role: "distributor",
//   });

//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(user.password, salt);

//   await user.save();

//   res.send({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//   });
// });


// router.post("/create-distributor", async (req, res) => {
//   try {
//     // Always lowercase the role before validation
//     if (req.body.role) {
//       req.body.role = req.body.role.toLowerCase();
//     }

//     // Validate request body
//     const { error } = validate(req.body);
//     if (error) {
//       console.log("Validation error:", error.details[0].message);
//       return res.status(400).send(error.details[0].message);
//     }

//     // Check if user already exists
//     let user = await User.findOne({ email: req.body.email });
//     if (user) return res.status(400).send("User already registered.");

//     // Create new distributor
//     user = new User({
//       name: req.body.name,
//       email: req.body.email,
//       phoneNumber: req.body.phoneNumber,
//       password: req.body.password,
//       role: "distributor",
//       location: {
//         country: req.body.country,
//         state: req.body.state,
//         city: req.body.city
//       }
//     });

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);

//     await user.save();

//     res.send({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       country: user.country,
//       state: user.state,
//       city: user.city
//     });
//   } catch (err) {
//     console.error("Error in /create-distributor:", err);
//     res.status(500).send("Internal server error");
//   }
// });

router.post("/create-distributor", async (req, res) => {
  try {
    const { name, email, phoneNumber, password, role, country, state, city } = req.body;

    // Optional validation
    if (!name || !email || !phoneNumber || !password || !country || !state || !city) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Hash password (if you’re doing that)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDistributor = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      country,
      state,
      city
    });

    await newDistributor.save();

    res.status(201).json({ message: "Distributor created successfully", distributor: newDistributor });
  } catch (err) {
    console.error("Error creating distributor:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// ✅ Update user's last seen
router.post("/update-last-seen", async (req, res) => {
  try {
    const { email, lastSeen } = req.body;
    if (!email || !lastSeen) {
      return res.status(400).json({ error: "Missing email or lastSeen" });
    }

    // Update inside user collection
    await User.updateOne(
      { email },
      { $set: { lastSeen } },
      { upsert: false }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error updating last seen:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Fetch last seen for multiple users
router.post("/get-last-seen", async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({ error: "Invalid emails list" });
    }

    const users = await User.find({ email: { $in: emails } }, { email: 1, lastSeen: 1 });
    const result = {};
    users.forEach(u => {
      result[u.email] = u.lastSeen || 0;
    });

    res.json(result);
  } catch (err) {
    console.error("Error fetching last seen:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;