const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const marketplaceRoutes = require('./routes/marketplace');
const adminRoutes = require('./routes/admin');
const llmRoutes = require('./routes/llmRoutes')

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
 console.log("connected");
})
.catch((err)=>{
 console.log("error",err);
})

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/marketplace', marketplaceRoutes);
//app.use('/api/admin', adminRoutes);
app.use('/api/llm', llmRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
