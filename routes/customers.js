const { Customer, validate } = require("../models/customer");
const express = require('express');
const router = express.Router();

router.get('/', async(req, res) => {
    const customer = await Customer.find().sort('name')
    res.send(customer)
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(400).send('customer with the given id not found');

    res.send(customer)
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer) return res.status(400).send('customer with the given id not found');
    
    res.send(customer)
});

router.post('/', async (req, res) => { 
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message)
    
    let customer = await Customer.findOne({ email: req.body.email });
    if (customer) return res.status(400).send('customer already exist.');
    
    customer = new Customer({
        profilePicture: req.body.profilePicture,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city
    });
    customer = await customer.save()
    res.send(customer)
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.send(404).send(error.details[0].message)
    
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        profilePicture: req.body.profilePicture,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city
    },
        { new: true });
    if (!customer) return res.status(400).send('customer with the given id not found');

    res.send(customer)
});

module.exports = router
