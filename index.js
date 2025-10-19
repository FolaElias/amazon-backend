const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const app = express()
const product = require('./routes/products');
const customer = require('./routes/customers');
const config = require('config');
const user = require('./routes/users');
const auth = require('./routes/auth');
const cart = require('./routes/carts')
const order = require('./routes/orders');
const category = require('./routes/categories')
const location = require('./routes/distributorsLocation');
const { required } = require("joi/lib/types/object");
require('dotenv').config();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose.connect('mongodb://localhost/foodamazon')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', err))


app.use(express.json())
app.use(cors());
app.use('/amazon/document/api/products', product);
app.use('/amazon/document/api/customers', customer);
app.use('/amazon/document/api/register', user);
app.use('/amazon/document/api/login', auth);
app.use('/amazon/document/api/carts', cart);
app.use('/amazon/document/api/orders', order);
app.use('/amazon/document/api/locations', location);
app.use('/amazon/document/api/categories', category);





const port = process.env.PORT || 3001

app.listen(port, () => console.log(`listening on port ${port}...`))