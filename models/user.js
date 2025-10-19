const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 11,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  role: {
    type: String,
    enum: ["super_admin", "distributor", "customer"],
    default: "customer", // default role
  },
  country: {
    type: String,
    required: false
  }, 
  state: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  lastSeen: {
    type: Number,
    default: Date.now 
    
  }


});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role }, // store role in token
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    phoneNumber: Joi.string().min(5).max(11).required(),
      password: Joi.string().min(5).max(255).required(),
    country: Joi.string(),
    state: Joi.string(),
    city: Joi.string(),
    role: Joi.string().valid("super_admin", "distributor", "customer"),
    lastSeen: Joi.number()
  };
  return Joi.validate(user, schema);
}

function validateLogin(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(req, schema);
}

exports.User = User;
exports.validate = validateUser;
exports.validateLogin = validateLogin