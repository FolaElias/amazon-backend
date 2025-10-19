const {User, validateLogin} = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash')
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('invalid email or password.');


    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('invalid email or password.');

    // const token = jwt.sign({_id: user._id,name: user.name}, config.get('jwtPrivateKey'));
    // res.json({token: token, name: user.name, email: user.email} )
     const token = user.generateAuthToken();
    res.json({ token: token, name: user.name, email: user.email, phoneNumber: user.phoneNumber });
});

    router.post("/distributor", async (req, res) => {
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Invalid email or password.");

        if (user.role !== "distributor") {
            return res.status(403).send("Access denied. Not a distributor account.");
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send("Invalid email or password.");

        const token = user.generateAuthToken();
        res.send({ token, role: user.role, name: user.name, email: user.email, city: user.city });
        });



module.exports = router