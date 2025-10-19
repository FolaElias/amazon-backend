const mongoose = require('mongoose');
const Joi = require('joi');


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 15
    },
    image: {
        type: String,
        required: true
    }
})

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {
    const schema = {
        name: Joi.string().min(3).max(15).required(),
        image: Joi.string().required()
    }
    return Joi.validate(category, schema)
}

exports.Category = Category;
exports.validate = validateCategory
exports.categorySchema = categorySchema