const {User, validate} = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash')
const bcrypt = require('bcrypt');

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
module.exports = router;