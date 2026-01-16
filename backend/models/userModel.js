const db = require('../config/db');

const UserModel = {
  // Tìm user theo username
  findByUsername: (username, callback) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], callback);
  },

  // Tạo user mới
  create: (userData, callback) => {
    const sql = 'INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [userData.username, userData.password, userData.full_name, userData.role || 'user'], callback);
  }
};

module.exports = UserModel;