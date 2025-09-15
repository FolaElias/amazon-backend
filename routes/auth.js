const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash')
const bcrybt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('invalid email or password.');


    const validPassword = await bcrybt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('invalid email or password.');

    // const token = jwt.sign({_id: user._id,name: user.name}, config.get('jwtPrivateKey'));
    // res.json({token: token, name: user.name, email: user.email} )
     const token = user.generateAuthToken();
    res.json({ token: token, name: user.name, email: user.email });
});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(req, schema);
}

module.exports = router