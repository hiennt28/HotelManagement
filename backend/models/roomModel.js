const db = require('../config/db');

const RoomModel = {
  // Lấy tất cả phòng
  getAll: (callback) => {
    const query = 'SELECT * FROM rooms ORDER BY room_number ASC';
    db.query(query, callback);
  },

  // Thêm phòng mới
  create: (newRoom, callback) => {
    const query = 'INSERT INTO rooms SET ?';
    db.query(query, newRoom, callback);
  },

  // Xóa phòng
  delete: (id, callback) => {
    const query = 'DELETE FROM rooms WHERE id = ?';
    db.query(query, [id], callback);
  },

  update: (id, roomData, callback) => {
    const query = 'UPDATE rooms SET room_number = ?, type = ?, price = ?, image_url = ? WHERE id = ?';
    db.query(query, [roomData.room_number, roomData.type, roomData.price, roomData.image_url, id], callback);
  },
  
  // Cập nhật trạng thái phòng (Dùng khi Check-in/Check-out)
  updateStatus: (id, status, callback) => {
    const query = 'UPDATE rooms SET status = ? WHERE id = ?';
    db.query(query, [status, id], callback);
  }
};

module.exports = RoomModel;