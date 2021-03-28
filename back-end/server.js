const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// Configure multer so that it will upload to '../front-end/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

// Create a scheme for users.
const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  city: String,
});

// Create a scheme for items in the current listings.
const itemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  title: String,
  description: String,
  price: String,
  path: String,
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);

const User = mongoose.model('User', userSchema);

// connect to the database
mongoose.connect('mongodb://localhost:27017/listings', {
  useNewUrlParser: true
});

// Create a new user in the current listings.
app.post('/api/users', async (req, res) => {
  const user = new User({
    name: req.body.name,
    phone: req.body.phone,
    city: req.body.city,
  });
  try {
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Create a new item in the current listings.
app.post('/api/users/:userID/items', async (req, res) => {
  try {
    console.log("test!!!");
    console.log(req.params.userID);
    let user = await User.findOne({_id: req.params.userID});
    console.log(user);
    if (!user) {
      res.send(404);
      return;
    }
    let item = new Item({
      title: req.body.title,
      description: req.body.description,
      user: user,
      price: req.body.price,
      path: req.body.path,
    });
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

// Get a list of all of the current users.
app.get('/api/users', async (req, res) => {
  try {
    let users = await User.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items of a single user.
app.get('/api/users/:userID/items', async (req, res) => {
  try {
    let user = await User.findOne({_id: req.params.userID});
    if (!project) {
      res.send(404);
      return;
    }
    let items = await Item.find({user:user});
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items for the listings.
app.get('/api/items', async (req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete a user.
app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete an item from the current listings.
app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Edit a User.
app.put('/api/users/:id', async (req, res) => {
  try {
    let user = await User.findOne({
      _id: req.params.id
    });
    item.city = req.body.city;
    item.phone = req.body.phone;
    item.name = req.body.name;
    user.save();
    res.sendStatus(200);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Edit an item in the current listings.
app.put('/api/items/:id', async (req, res) => {
  try {
    let item = await Item.findOne({
      _id: req.params.id
    });
    item.title = req.body.title;
    item.description = req.body.description;
    item.price = req.body.price;

    item.save();
    res.sendStatus(200);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
