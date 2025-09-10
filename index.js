const express = require("express");
const mongoose = require('mongoose');
const app = express()
const product = require('./routes/products');
const customer = require('./routes/customers');
const config = require('config');
const user = require('./routes/users');
const auth = require('./routes/auth');

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose.connect('mongodb://localhost/foodamazon')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', err))


app.use(express.json())
app.use('/amazon/document/api/products', product);
app.use('/amazon/document/api/customers', customer);
app.use('/amazon/document/api/register', user);
app.use('/amazon/document/api/login', auth);

const port = process.env.PORT || 3001

app.listen(port, () => console.log(`listening on port ${port}...`))