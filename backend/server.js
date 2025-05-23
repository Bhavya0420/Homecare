const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/homecare', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Load models
const User = require('./models/User');

// Test route
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).send("User registered successfully!");
  } catch (error) {
    res.status(500).send("Registration failed.");
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found.');
    }

    if (user.password !== password) {
      return res.status(401).send('Incorrect password.');
    }

    res.send(`Welcome, ${user.name}`);
  } catch (error) {
    res.status(500).send('Login failed.');
  }
});


// Start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
