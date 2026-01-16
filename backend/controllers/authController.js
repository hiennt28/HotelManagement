const UserModel = require('../models/userModel');

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
  }

  UserModel.findByUsername(username, (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi Server: ' + err.message });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Tài khoản không tồn tại' });
    }

    const user = results[0];

    // LƯU Ý: Ở đây so sánh password thô (plain text) để đơn giản hóa việc học.
    // Thực tế bạn NÊN dùng thư viện 'bcrypt' để so sánh mật khẩu đã mã hóa.
    if (password !== user.password) {
      return res.status(401).json({ message: 'Sai mật khẩu' });
    }

    // Trả về thông tin user (loại bỏ password để bảo mật)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: userWithoutPassword
    });
  });
};

exports.register = (req, res) => {
  const { username, password, full_name, role } = req.body;

  if (!username || !password || !full_name) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
  }

  // Bước 1: Kiểm tra xem username đã tồn tại chưa
  UserModel.findByUsername(username, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (results.length > 0) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
    }

    // Bước 2: Tạo user mới
    UserModel.create({ username, password, full_name, role }, (err, result) => {
      if (err) return res.status(500).json({ error: 'Lỗi đăng ký: ' + err.message });
      res.json({ success: true, message: 'Đăng ký thành công!' });
    });
  });
};

// Thêm hàm updateProfile
exports.updateProfile = (req, res) => {
    const { id, full_name, phone, password } = req.body;
    // Nếu có password mới thì update cả password, không thì chỉ update thông tin
    let query = "UPDATE users SET full_name = ?, phone = ? WHERE id = ?";
    let params = [full_name, phone, id];

    if (password) {
        query = "UPDATE users SET full_name = ?, phone = ?, password = ? WHERE id = ?";
        params = [full_name, phone, password, id];
    }

    const db = require('../config/db'); // Đảm bảo import db
    db.execute(query, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Cập nhật hồ sơ thành công!' });
    });
};