const {User, validate} = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash')
const bcrybt = require('bcrypt');

router.post('/', async(req, res) => {
const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
let user = await User.findOne({ email: req.body.email, phoneNumber: req.body.phoneNumber });
    if (user) return res.status(400).send('User already registered.');
    
    user = new User({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
    });
    const salt = await bcrybt.genSalt(10);
    user.password = await bcrybt.hash(user.password, salt);
    
    
    
        await user.save();
    res.send(_.pick(user, ['_id', 'name', 'email', 'phoneNumber']));
})
     

module.exports = router