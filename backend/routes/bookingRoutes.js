const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');



// Định nghĩa các đường dẫn (Routes)
router.post('/add', bookingController.createBooking);
router.get('/all', bookingController.getAllBookings);
router.put('/:id/status', bookingController.updateStatus);
router.get('/stats', bookingController.getStats);
router.get('/my-bookings', bookingController.getUserBookings);
module.exports = router;