const mongoose = require('mongoose');
const Joi = require('joi')

const productSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true,
        Minlength: 5,
        Maxlenght: 50,
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required: true,
        Minlength: 10,
        Maxlenght: 500
    },
    rating: {
        type: String,
        default: false
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 1000,
        required: true
    }
})

const Product = mongoose.model('Product', productSchema)

function validateProduct(product) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        image: Joi.string().required(),
        price: Joi.string().required(),
        description: Joi.string().min(10).max(500).required(),
        // rating: Joi.string().boolen(),
        numberInStock: Joi.number().min(0).max(1000).required()
    }
     return Joi.validate(product, schema)
}


exports.Product = Product;
exports.validate = validateProduct;