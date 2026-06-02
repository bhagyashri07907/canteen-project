const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const admin = require('firebase-admin');

// Firebase Admin Setup (Optional for Background Push Notifications)
/*
const serviceAccount = require("./path/to/your/firebase-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
*/

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/canteenDB')
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// USER SCHEMA
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  branch: String,
  year: String,
  password: String
});

const User = mongoose.model("User", userSchema);


// ORDER SCHEMA
const orderSchema = new mongoose.Schema({

  customerName: String,
  customerUsername: String,
  items: Array,
  total: Number,
  paymentMethod: String,
  tableNumber: String,
  status: {
    type: String,
    default: "Pending"
  },

  date: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    default: 'Pending'
  },
  transactionId: {
    type: String,
    default: ''
  }

});

const Order = mongoose.model("Order", orderSchema);


// REGISTER API
app.post('/register', async (req, res) => {
  const { username, email, branch, year, password } = req.body;

  try {

    const existingUser = await User.findOne({ username });

    if(existingUser){

      return res.json({
        message: "User Already Exists"
      });

    }

    const user = new User({
      username,
      email,
      branch,
      year,
      password
    });

    await user.save();

    res.json({
      message: "Registration Successful"
    });

  } catch(err){

    res.status(500).json({
      error: err.message
    });

  }

});


// LOGIN API
app.post('/login', async (req, res) => {

  const { username, password } = req.body;

  try {

    const user = await User.findOne({
      username,
      password
    });

    if(user){

      res.json({
        success: true,
        message: "Login Successful"
      });

    }
    else{

      res.json({
        success: false,
        message: "Invalid Credentials"
      });

    }

  } catch(err){

    res.status(500).json({
      error: err.message
    });

  }

});


// ORDER API
app.post('/place-order', async (req, res) => {

  try {

    const order = new Order(req.body);
    console.log("New Order Received:", req.body);
    await order.save();
    console.log("Order saved successfully");
    
    // Emit new order to admin
    io.emit('new-order', order);
    
    res.json({
      message: "Order Saved Successfully",
      orderId: order._id
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});


// ADMIN API: GET ORDERS
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 }); // newest first
    console.log(`Fetched ${orders.length} orders`);
    res.json({ orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE ORDER BY ID
app.get('/order/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/my-orders/:username', async (req, res) => {
  try {
    const orders = await Order.find({ customerUsername: req.params.username }).sort({ date: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN API: UPDATE ORDER STATUS
app.post('/update-order-status', async (req, res) => {
  const { orderId, status, paymentStatus } = req.body;
  try {
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true });
    
    // Emit status update to customer
    io.emit('order-status-updated', { orderId, status });
    
    res.json({ message: "Status updated successfully", order });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN API: GET USERS
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude password
    res.json({ users });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});


// CUSTOMER API: RATE ORDER
app.post('/rate-order', async (req, res) => {
  const { orderId, rating } = req.body;
  try {
    await Order.findByIdAndUpdate(orderId, { rating });
    res.json({ message: "Rating saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CUSTOMER API: SUBMIT TRANSACTION ID
app.post('/verify-payment', async (req, res) => {
  const { orderId, transactionId } = req.body;
  try {
    await Order.findByIdAndUpdate(orderId, { transactionId, paymentStatus: 'Paid (To be Verified)' });
    res.json({ message: "Transaction ID submitted for verification" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// START SERVER
server.listen(5000, () => {
  console.log("Server Running on Port 5000 with Socket.io");
});