const express = require('express');
const router = express.Router();

const roomController = require('../controllers/roomController');

// Định nghĩa các đường dẫn cho PHÒNG
// GET http://localhost:3001/api/rooms (Lấy danh sách phòng)
router.get('/', roomController.getRooms);

// POST http://localhost:3001/api/rooms/add (Thêm phòng mới)
router.post('/add', roomController.addRoom);

// DELETE http://localhost:3001/api/rooms/:id (Xóa phòng)
router.delete('/:id', roomController.deleteRoom);
router.put('/:id', roomController.updateRoom);
module.exports = router;