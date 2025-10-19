const mongoose = require('mongoose');
const Joi = require('joi');

const distributorLocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    }

});


const Location = mongoose.model('Location', distributorLocationSchema);

function validateLocation(location) {
    const schema = {
        name: Joi.string()
    }
    return Joi.validate(location, schema)
}

exports.Location = Location;
exports.validate = validateLocation;
exports.distributorLocationSchema = distributorLocationSchema
