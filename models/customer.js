const mongoose = require('mongoose');
const Joi = require('joi');



const customerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        Minlength: 5,
        Maxlenght: 50,
    },  
    lastName: {
        type: String,
        required: true,
        Minlength: 5,
        Maxlenght: 50,
    },
    email: {
        type: String,
        required: true,
        Minlength: 5,
        Maxlenght: 255,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        Minlength: 5,
        Maxlenght: 11,
    },
    dateOfBirth: {
        type: Date,
        required: true,
        set: (val) => (typeof val === "string" ? new Date(val) : val)
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'],
        lowercase: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true, 
    },
    address: {
        type: String,
        required: true
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) { 
    const schema = {
        firstName: Joi.string().min(5).max(50).required(),
        lastName: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        phone: Joi.string().min(5).max(11).required(),
        dateOfBirth: Joi.date().required(),
        gender: Joi.string().valid('male', 'female').insensitive().required(),
        country: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        address: Joi.string().required()
    };
    return Joi.validate(customer, schema);
}
    
exports.Customer = Customer;
exports.validate = validateCustomer;
