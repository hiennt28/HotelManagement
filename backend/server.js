const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import các Routes
const roomRoutes = require('./routes/roomRoutes');
const authRoutes = require('./routes/authRoutes');
// Import bookingRoutes
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sử dụng Routes
app.use('/api/rooms', roomRoutes);     // Quản lý phòng
app.use('/api/auth', authRoutes);      // Quản lý đăng nhập
//  Đăng ký đường dẫn cho đặt phòng
app.use('/api/bookings', bookingRoutes); 

// Route kiểm tra server
app.get('/', (req, res) => {
  res.send('Hotel Management API is running...');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});