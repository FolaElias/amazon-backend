
const { Product, validate } = require("../models/product");
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const superAdmin = require('../middleware/superadmin');
const isDistributor = require('../middleware/distributor');


router.get('/', async(req, res) => {
    const product = await Product.find().sort('name')
    res.send(product)
});

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(400).send('product with the given id not found');

    res.send(product)
});

router.delete('/:id', async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(400).send('product with the given id not found');
    
    res.send(product)
});


router.post('/',[auth, isDistributor], async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message) 
    
    let product = new Product({
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        description: req.body.description,
        numberInStock: req.body.numberInStock
    });

    product = await product.save()
    res.send(product)
});


router.put('/:id', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.send(404).send(error.details[0].message) 
    
    const product = await Product.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true }, {image: req.body.image}, {price: req.body.price}, {description: req.body.description}, {numberInStock: req.body.numberInStock});
    if (!product) return res.status(400).send('product with the given id not found');
    
    res.send(product)
});


module.exports = router

